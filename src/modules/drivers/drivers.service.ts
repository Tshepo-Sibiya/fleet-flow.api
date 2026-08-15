import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { Vehicle, VehicleDocument } from '../../schemas/vehicle.schema';
import { WeeklySettlement, WeeklySettlementDocument } from '../../schemas/weekly-settlement.schema';
import { AdvanceRequest, AdvanceRequestDocument, AdvanceStatus } from '../../schemas/advance-request.schema';
import { CheckInRate, CheckInRateDocument } from '../../schemas/check-in-rate.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(WeeklySettlement.name) private settlementModel: Model<WeeklySettlementDocument>,
    @InjectModel(AdvanceRequest.name) private advanceModel: Model<AdvanceRequestDocument>,
    @InjectModel(CheckInRate.name) private checkInRateModel: Model<CheckInRateDocument>,
  ) {}

  async createDriver(ownerId: string, data: { fullName: string; email: string; phoneNumber?: string; password?: string }) {
    const existing = await this.userModel.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const defaultPassword = data.password || 'Driver123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const driver = await this.userModel.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber || '',
      role: UserRole.DRIVER,
      ownerId,
    });

    // Default initial check-in rate (R2200) for driver
    const today = new Date();
    const mondayStr = this.getMondayString(today);
    await this.checkInRateModel.create({
      driverId: driver._id,
      ownerId,
      weeklyAmount: 2200,
      effectiveWeekStart: mondayStr,
    });

    const driverObj = driver.toObject();
    delete driverObj.password;
    return driverObj;
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
    // 1. Get latest settled week closing debt balance
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

    // 2. Add any approved advances created AFTER the last settlement
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

    // Find rate for current week or latest available rate
    const rateDoc = await this.checkInRateModel
      .findOne({ driverId, effectiveWeekStart: { $lte: mondayStr } })
      .sort({ effectiveWeekStart: -1 })
      .exec();

    return rateDoc ? rateDoc.weeklyAmount : 2200; // default R2200
  }

  private getMondayString(d: Date): string {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
  }
}
