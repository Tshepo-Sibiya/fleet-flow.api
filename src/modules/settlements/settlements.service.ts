import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeeklySettlement, WeeklySettlementDocument } from '../../schemas/weekly-settlement.schema';
import { User, UserDocument, UserRole } from '../../schemas/user.schema';
import { Vehicle, VehicleDocument } from '../../schemas/vehicle.schema';
import { CheckInRatesService } from '../check-in-rates/check-in-rates.service';
import { DriversService } from '../drivers/drivers.service';
import { CalculateSettlementDto, CreateSettlementDto } from './dto/settlement.dto';

@Injectable()
export class SettlementsService {
  constructor(
    @InjectModel(WeeklySettlement.name) private settlementModel: Model<WeeklySettlementDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    private checkInRatesService: CheckInRatesService,
    private driversService: DriversService,
  ) {}

  async calculatePreview(ownerId: string, dto: CalculateSettlementDto) {
    const driver = await this.userModel.findById(dto.driverId);
    if (!driver || driver.role !== UserRole.DRIVER) {
      throw new NotFoundException('Driver not found');
    }

    const vehicle = await this.vehicleModel.findOne({ assignedDriverId: dto.driverId });

    const weekStartDate = dto.weekStartDate
      ? this.getMondayString(new Date(dto.weekStartDate))
      : this.getMondayString(new Date());

    const weekEndDate = this.getSundayString(new Date(weekStartDate));

    // Get fixed weekly check-in rate (e.g. R2200)
    const rateInfo = await this.checkInRatesService.getRateForDriver(dto.driverId, weekStartDate);
    const fixedCheckInAmount = rateInfo.weeklyAmount;

    // Get current debt balance carried over from prior weeks
    const openingDebtBalance = await this.driversService.getDriverCurrentDebt(dto.driverId);
    const approvedAdvancesThisWeek = 0; // Included in debt service
    const totalDebtOwed = openingDebtBalance + approvedAdvancesThisWeek;

    // Uber gross payout captured (e.g. R5000)
    const uberGrossPayout = dto.uberGrossPayout;

    // Deductions calculation:
    // 1. Owner keeps fixed weekly check-in (e.g. R2200)
    // 2. Debt repayment deduction: requested amount (e.g. R300 out of R600 owed)
    const requestedDeduction = dto.requestedDebtDeduction !== undefined ? dto.requestedDebtDeduction : totalDebtOwed;
    
    // Ensure debt deduction does not exceed total debt owed or available funds after check-in
    const maxAvailableForDebt = Math.max(0, uberGrossPayout - fixedCheckInAmount);
    const actualDebtDeducted = Math.min(requestedDeduction, totalDebtOwed, maxAvailableForDebt);

    // Remaining funds sent to driver
    const netDriverPayout = Math.max(0, uberGrossPayout - fixedCheckInAmount - actualDebtDeducted);

    // Debt carried over to next week
    const closingDebtBalance = totalDebtOwed - actualDebtDeducted;

    return {
      driverId: dto.driverId,
      driverName: driver.fullName,
      ownerId,
      vehicleId: vehicle ? vehicle._id : null,
      vehicleDetails: vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})` : 'Unassigned',
      weekStartDate,
      weekEndDate,
      uberGrossPayout,
      fixedCheckInAmount,
      openingDebtBalance,
      approvedAdvancesThisWeek,
      totalDebtOwed,
      requestedDebtDeduction: requestedDeduction,
      actualDebtDeducted,
      netDriverPayout,
      closingDebtBalance, // Carried over to next week!
    };
  }

  async createSettlement(ownerId: string, dto: CreateSettlementDto) {
    const preview = await this.calculatePreview(ownerId, dto);

    // Check if settlement already exists for this driver & week
    const existing = await this.settlementModel.findOne({
      driverId: dto.driverId,
      weekStartDate: preview.weekStartDate,
    });

    if (existing) {
      throw new BadRequestException(
        `A weekly settlement for week starting ${preview.weekStartDate} has already been recorded for this driver.`,
      );
    }

    const settlement = await this.settlementModel.create({
      driverId: preview.driverId,
      ownerId,
      vehicleId: preview.vehicleId,
      weekStartDate: preview.weekStartDate,
      weekEndDate: preview.weekEndDate,
      uberGrossPayout: preview.uberGrossPayout,
      fixedCheckInAmount: preview.fixedCheckInAmount,
      openingDebtBalance: preview.openingDebtBalance,
      approvedAdvancesThisWeek: preview.approvedAdvancesThisWeek,
      totalDebtOwed: preview.totalDebtOwed,
      requestedDebtDeduction: preview.requestedDebtDeduction,
      actualDebtDeducted: preview.actualDebtDeducted,
      netDriverPayout: preview.netDriverPayout,
      closingDebtBalance: preview.closingDebtBalance,
      notes: dto.notes || '',
    });

    return this.settlementModel
      .findById(settlement._id)
      .populate('driverId', 'fullName email phoneNumber')
      .populate('vehicleId', 'make model registrationNumber')
      .exec();
  }

  async findAllForUser(user: any) {
    const filter = user.role === UserRole.DRIVER ? { driverId: user._id } : { ownerId: user._id };

    return this.settlementModel
      .find(filter)
      .populate('driverId', 'fullName email phoneNumber')
      .populate('vehicleId', 'make model registrationNumber')
      .sort({ weekStartDate: -1 })
      .exec();
  }

  async getFinancialSummary(user: any) {
    const filter = user.role === UserRole.DRIVER ? { driverId: user._id } : { ownerId: user._id };

    const settlements = await this.settlementModel.find(filter).exec();

    // Aggregates for Current Week and Monthly
    const now = new Date();
    const currentMonday = this.getMondayString(now);
    const currentMonth = now.toISOString().slice(0, 7); // "YYYY-MM"

    let currentWeekGross = 0;
    let currentWeekOwnerKeep = 0;
    let currentWeekDriverNet = 0;

    let monthGross = 0;
    let monthOwnerKeep = 0; // Check-in + Debt collected
    let monthDriverNet = 0;
    let monthDebtCollected = 0;

    settlements.forEach((s) => {
      // Month calculation
      if (s.weekStartDate.startsWith(currentMonth)) {
        monthGross += s.uberGrossPayout;
        monthOwnerKeep += s.fixedCheckInAmount + s.actualDebtDeducted;
        monthDriverNet += s.netDriverPayout;
        monthDebtCollected += s.actualDebtDeducted;
      }

      // Current week calculation
      if (s.weekStartDate === currentMonday) {
        currentWeekGross = s.uberGrossPayout;
        currentWeekOwnerKeep = s.fixedCheckInAmount + s.actualDebtDeducted;
        currentWeekDriverNet = s.netDriverPayout;
      }
    });

    return {
      currentWeek: {
        weekStartDate: currentMonday,
        grossPayout: currentWeekGross,
        ownerShare: currentWeekOwnerKeep,
        driverNetPayout: currentWeekDriverNet,
      },
      currentMonth: {
        monthYear: currentMonth,
        grossPayout: monthGross,
        ownerTotalEarned: monthOwnerKeep,
        driverTotalPayout: monthDriverNet,
        totalDebtCollected: monthDebtCollected,
        settlementCount: settlements.filter((s) => s.weekStartDate.startsWith(currentMonth)).length,
      },
    };
  }

  private getMondayString(d: Date): string {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  private getSundayString(mondayDate: Date): string {
    const sunday = new Date(mondayDate);
    sunday.setDate(sunday.getDate() + 6);
    return sunday.toISOString().split('T')[0];
  }
}
