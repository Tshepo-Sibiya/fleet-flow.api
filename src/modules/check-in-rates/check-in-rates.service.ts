import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CheckInRate, CheckInRateDocument } from '../../schemas/check-in-rate.schema';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { SetCheckInRateDto } from './dto/check-in-rate.dto';

@Injectable()
export class CheckInRatesService {
  constructor(
    @InjectModel(CheckInRate.name) private checkInRateModel: Model<CheckInRateDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async setRate(ownerId: string, dto: SetCheckInRateDto) {
    const driver = await this.userModel.findById(dto.driverId);
    if (!driver || driver.role !== UserRole.DRIVER) {
      throw new NotFoundException('Driver not found');
    }

    const currentMondayStr = this.getMondayString(new Date());
    const targetMondayStr = this.getMondayString(new Date(dto.effectiveWeekStart));

    // Rule: Owner can change check-in, BUT if the week has ALREADY STARTED, owner CANNOT change check-in for that week!
    if (targetMondayStr <= currentMondayStr) {
      throw new BadRequestException(
        `Weekly check-in rate for current or past week (${targetMondayStr}) is locked and cannot be modified once the week has started.`,
      );
    }

    const rate = await this.checkInRateModel.findOneAndUpdate(
      { driverId: dto.driverId, effectiveWeekStart: targetMondayStr },
      {
        ownerId,
        weeklyAmount: dto.weeklyAmount,
        effectiveWeekStart: targetMondayStr,
      },
      { upsert: true, new: true },
    );

    return rate;
  }

  async getRateForDriver(driverId: string, weekStartDate?: string) {
    const mondayStr = weekStartDate
      ? this.getMondayString(new Date(weekStartDate))
      : this.getMondayString(new Date());

    const rateDoc = await this.checkInRateModel
      .findOne({ driverId, effectiveWeekStart: { $lte: mondayStr } })
      .sort({ effectiveWeekStart: -1 })
      .exec();

    return {
      driverId,
      effectiveWeekStart: mondayStr,
      weeklyAmount: rateDoc ? rateDoc.weeklyAmount : 2200, // default R2200
      isLocked: mondayStr <= this.getMondayString(new Date()),
    };
  }

  private getMondayString(d: Date): string {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
  }
}
