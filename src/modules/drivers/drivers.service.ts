import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { Vehicle, VehicleDocument } from '../../schemas/vehicle.schema';
import { WeeklySettlement, WeeklySettlementDocument } from '../../schemas/weekly-settlement.schema';
import { AdvanceRequest, AdvanceRequestDocument, AdvanceStatus } from '../../schemas/advance-request.schema';
import { CheckInRate, CheckInRateDocument } from '../../schemas/check-in-rate.schema';
import { EmailService } from '../email/email.service';
import { InviteDriverDto } from './dto/driver.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(WeeklySettlement.name) private settlementModel: Model<WeeklySettlementDocument>,
    @InjectModel(AdvanceRequest.name) private advanceModel: Model<AdvanceRequestDocument>,
    @InjectModel(CheckInRate.name) private checkInRateModel: Model<CheckInRateDocument>,
    private emailService: EmailService,
  ) {}

  async inviteDriver(ownerId: string, dto: InviteDriverDto) {
    const owner = await this.userModel.findById(ownerId);
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    if (dto.email.toLowerCase() === owner.email.toLowerCase()) {
      throw new BadRequestException('As a Fleet Owner, you cannot add yourself as a driver.');
    }

    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      if (existing.role === UserRole.OWNER) {
        throw new BadRequestException('This email is registered to a Fleet Owner and cannot be invited as a Driver.');
      }
      throw new BadRequestException('A driver with this email address is already registered.');
    }

    const inviteToken = crypto.randomBytes(32).toString('hex');

    const driver = await this.userModel.create({
      email: dto.email.toLowerCase(),
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber || '',
      role: UserRole.DRIVER,
      ownerId,
      companyName: owner.companyName || '',
      isConfirmed: false,
      isInvitePending: true,
      inviteToken,
    });

    // Link vehicle if selected
    if (dto.vehicleId) {
      const vehicle = await this.vehicleModel.findOne({ _id: dto.vehicleId, ownerId });
      if (vehicle) {
        vehicle.assignedDriverId = driver._id.toString();
        await vehicle.save();
      }
    }

    // Default initial check-in rate (R2200) for driver
    const today = new Date();
    const mondayStr = this.getMondayString(today);
    await this.checkInRateModel.create({
      driverId: driver._id,
      ownerId,
      weeklyAmount: 2200,
      effectiveWeekStart: mondayStr,
    });

    // Send Driver Invitation Email via Resend
    await this.emailService.sendDriverInviteEmail(
      driver.email,
      driver.fullName,
      owner.companyName || owner.fullName,
      inviteToken,
    );

    return {
      message: `Invitation email sent via Resend to ${driver.email}. The driver can set up credentials via the email link.`,
      driverId: driver._id,
      inviteToken,
    };
  }

  async findAllForOwner(ownerId: string) {
    const drivers = await this.userModel.find({ ownerId, role: UserRole.DRIVER }).select('-password').exec();

    const result = await Promise.all(
      drivers.map(async (driver) => {
        const vehicle = await this.vehicleModel.findOne({ assignedDriverId: driver._id }).exec();
        const currentDebt = await this.getDriverCurrentDebt(driver._id.toString());
        const currentRate = await this.getDriverCurrentCheckInRate(driver._id.toString());
        return {
          ...driver.toObject(),
          assignedVehicle: vehicle || null,
          currentDebtBalance: currentDebt,
          weeklyCheckInAmount: currentRate,
        };
      }),
    );

    return result;
  }

  async getDriverDetails(driverId: string) {
    const driver = await this.userModel.findById(driverId).select('-password').exec();
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }
    const vehicle = await this.vehicleModel.findOne({ assignedDriverId: driverId }).exec();
    const currentDebt = await this.getDriverCurrentDebt(driverId);
    const currentRate = await this.getDriverCurrentCheckInRate(driverId);
    return {
      ...driver.toObject(),
      assignedVehicle: vehicle || null,
      currentDebtBalance: currentDebt,
      weeklyCheckInAmount: currentRate,
    };
  }

  async getDriverCurrentDebt(driverId: string): Promise<number> {
    const latestSettlement = await this.settlementModel
      .findOne({ driverId })
      .sort({ weekStartDate: -1 })
      .exec();

    let baseDebt = 0;
    let baseDate: Date | null = null;

    if (latestSettlement) {
      baseDebt = latestSettlement.closingDebtBalance;
      baseDate = new Date((latestSettlement as any).createdAt);
    }

    const query: any = {
      driverId,
      status: AdvanceStatus.APPROVED,
    };
    if (baseDate) {
      query.createdAt = { $gt: baseDate };
    }

    const approvedAdvances = await this.advanceModel.find(query).exec();
    const advancesSum = approvedAdvances.reduce((acc, curr) => acc + curr.amount, 0);

    return baseDebt + advancesSum;
  }

  async getDriverCurrentCheckInRate(driverId: string): Promise<number> {
    const today = new Date();
    const mondayStr = this.getMondayString(today);

    const rateDoc = await this.checkInRateModel
      .findOne({ driverId, effectiveWeekStart: { $lte: mondayStr } })
      .sort({ effectiveWeekStart: -1 })
      .exec();

    return rateDoc ? rateDoc.weeklyAmount : 2200;
  }

  private getMondayString(d: Date): string {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
  }
}
