import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdvanceRequest, AdvanceRequestDocument, AdvanceStatus, AdvanceType } from '../../schemas/advance-request.schema';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { CreateAdvanceRequestDto, UpdateAdvanceStatusDto } from './dto/advance.dto';

@Injectable()
export class AdvancesService {
  constructor(
    @InjectModel(AdvanceRequest.name) private advanceModel: Model<AdvanceRequestDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createRequest(driverId: string, dto: CreateAdvanceRequestDto) {
    const driver = await this.userModel.findById(driverId);
    if (!driver || driver.role !== UserRole.DRIVER) {
      throw new BadRequestException('Invalid driver user');
    }

    if (!driver.ownerId) {
      throw new BadRequestException('Driver is not linked to a Fleet Owner yet');
    }

    const advance = await this.advanceModel.create({
      driverId,
      ownerId: driver.ownerId,
      amount: dto.amount,
      reason: dto.reason,
      type: dto.type || AdvanceType.REGULAR_ADVANCE,
      status: AdvanceStatus.PENDING,
    });

    return this.advanceModel
      .findById(advance._id)
      .populate('driverId', 'fullName email phoneNumber')
      .populate('ownerId', 'fullName email companyName')
      .exec();
  }

  async findAllForUser(user: any) {
    if (user.role === UserRole.DRIVER) {
      return this.advanceModel
        .find({ driverId: user._id })
        .populate('ownerId', 'fullName email companyName')
        .sort({ createdAt: -1 })
        .exec();
    }
    return this.advanceModel
      .find({ ownerId: user._id })
      .populate('driverId', 'fullName email phoneNumber')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(id: string, ownerId: string, dto: UpdateAdvanceStatusDto) {
    const advance = await this.advanceModel.findOne({ _id: id, ownerId });
    if (!advance) {
      throw new NotFoundException('Advance request not found');
    }

    if (advance.status !== AdvanceStatus.PENDING) {
      throw new BadRequestException(`Advance request is already ${advance.status}`);
    }

    advance.status = dto.status;
    advance.reviewedAt = new Date();
    if (dto.notes) {
      advance.notes = dto.notes;
    }

    await advance.save();

    return this.advanceModel
      .findById(advance._id)
      .populate('driverId', 'fullName email phoneNumber')
      .populate('ownerId', 'fullName email companyName')
      .exec();
  }
}
