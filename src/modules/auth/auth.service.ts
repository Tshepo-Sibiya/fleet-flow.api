import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { RegisterOwnerDto, LoginDto, SetupDriverCredentialsDto, RegisterDriverWithTokenDto, ChangePasswordDto } from './dto/auth.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async registerOwner(dto: RegisterOwnerDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password and Confirm Password do not match');
    }

    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw new BadRequestException('Email address is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.userModel.create({
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      fullName: dto.fullName,
      companyName: dto.companyName,
      phoneNumber: dto.phoneNumber || '',
      role: UserRole.OWNER,
      isConfirmed: false,
      confirmationToken,
      isInvitePending: false,
    });

    const appUrl = this.configService.get<string>('APP_URL') || 'https://fleet-flowapi-production.up.railway.app';
    const confirmUrl = `${appUrl}/api/auth/confirm-email?token=${confirmationToken}`;

    // Send confirmation email via Resend
    await this.emailService.sendOwnerConfirmationEmail(user.email, user.fullName, confirmationToken);

    return {
      message: 'Registration successful! A confirmation link has been sent to your inbox. You can also activate your account instantly below.',
      email: user.email,
      confirmationToken,
      confirmUrl,
    };
  }

  async confirmEmail(token: string) {
    const user = await this.userModel.findOne({ confirmationToken: token });
    if (!user) {
      throw new BadRequestException('Invalid or expired email confirmation token');
    }

    user.isConfirmed = true;
    user.confirmationToken = null;
    await user.save();

    return {
      success: true,
      message: 'Your email address has been successfully confirmed! You can now log into the FleetFlow app.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedException('Invalid email address or password');
    }

    if (!user.password) {
      throw new UnauthorizedException('Driver password not set up yet. Enter your invitation code to set up your password.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email address or password');
    }

    if (!user.isConfirmed) {
      throw new BadRequestException(
        'Please confirm your email address before logging in. Check your inbox for the confirmation link.',
      );
    }

    const token = this.generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.confirmationToken;
    delete userObj.inviteToken;

    return {
      user: userObj,
      token,
    };
  }

  async getDriverInvite(token: string) {
    const cleanToken = token.trim();
    const user = await this.userModel.findOne({
      inviteToken: { $regex: new RegExp(`^${cleanToken}$`, 'i') },
      role: UserRole.DRIVER,
    });

    if (!user) {
      throw new NotFoundException('Invalid or expired driver invitation token code.');
    }

    let ownerCompanyName = 'Fleet Owner';
    if (user.ownerId) {
      const owner = await this.userModel.findById(user.ownerId);
      if (owner) {
        ownerCompanyName = owner.companyName || owner.fullName;
      }
    }

    return {
      email: user.email.includes('@fleetflow.temp') ? '' : user.email,
      fullName: user.fullName,
      ownerCompanyName,
      inviteToken: user.inviteToken,
    };
  }

  async registerDriverWithToken(dto: RegisterDriverWithTokenDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password and Confirm Password do not match');
    }

    const cleanToken = dto.inviteToken.trim();
    const user = await this.userModel.findOne({
      inviteToken: { $regex: new RegExp(`^${cleanToken}$`, 'i') },
      role: UserRole.DRIVER,
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired invitation token code. Please ask your Fleet Owner for a valid token.');
    }

    const existingEmail = await this.userModel.findOne({
      email: dto.email.toLowerCase(),
      _id: { $ne: user._id },
    });
    if (existingEmail) {
      throw new BadRequestException('This email address is already registered to another account.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    user.email = dto.email.toLowerCase();
    user.fullName = dto.fullName;
    user.password = hashedPassword;
    if (dto.phoneNumber) {
      user.phoneNumber = dto.phoneNumber;
    }
    user.isConfirmed = true;
    user.isInvitePending = false;
    user.inviteToken = null;

    await user.save();

    const authToken = this.generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.confirmationToken;
    delete userObj.inviteToken;

    return {
      message: 'Driver registration complete! Welcome to FleetFlow.',
      user: userObj,
      token: authToken,
    };
  }

  async setupDriverCredentials(dto: SetupDriverCredentialsDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password and Confirm Password do not match');
    }

    const cleanToken = dto.inviteToken.trim();
    const user = await this.userModel.findOne({
      inviteToken: { $regex: new RegExp(`^${cleanToken}$`, 'i') },
      role: UserRole.DRIVER,
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired driver invitation token');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    user.password = hashedPassword;
    user.isInvitePending = false;
    user.inviteToken = null;
    user.confirmationToken = null;
    user.isConfirmed = true;

    await user.save();

    const token = this.generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.confirmationToken;
    delete userObj.inviteToken;

    return {
      message: 'Driver password saved successfully! Your driver account is now active.',
      user: userObj,
      token,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    const user = await this.userModel.findById(userId);
    if (!user || !user.password) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await user.save();

    return { message: 'Password updated successfully' };
  }

  private generateToken(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      companyName: user.companyName,
    };
    return this.jwtService.sign(payload);
  }
}
