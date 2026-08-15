import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { Vehicle, VehicleDocument } from '../schemas/vehicle.schema';
import { CheckInRate, CheckInRateDocument } from '../schemas/check-in-rate.schema';
import { AdvanceRequest, AdvanceRequestDocument, AdvanceStatus } from '../schemas/advance-request.schema';
import { WeeklySettlement, WeeklySettlementDocument } from '../schemas/weekly-settlement.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(CheckInRate.name) private checkInRateModel: Model<CheckInRateDocument>,
    @InjectModel(AdvanceRequest.name) private advanceModel: Model<AdvanceRequestDocument>,
    @InjectModel(WeeklySettlement.name) private settlementModel: Model<WeeklySettlementDocument>,
  ) {}

  async seed() {
    console.log('--- Starting FleetFlow Database Seeding ---');

    // 1. Create Fleet Owner
    const ownerEmail = 'owner@fleetflow.co.za';
    let owner = await this.userModel.findOne({ email: ownerEmail });
    if (!owner) {
      const hashedPassword = await bcrypt.hash('Owner123!', 10);
      owner = await this.userModel.create({
        email: ownerEmail,
        password: hashedPassword,
        fullName: 'Sipho Nkosi (Fleet Owner)',
        phoneNumber: '+27 82 123 4567',
        role: UserRole.OWNER,
      });
      console.log('Created Fleet Owner: owner@fleetflow.co.za');
    }

    // 2. Create Drivers
    const driver1Email = 'driver.thabo@fleetflow.co.za';
    let driver1 = await this.userModel.findOne({ email: driver1Email });
    if (!driver1) {
      const hashedPassword = await bcrypt.hash('Driver123!', 10);
      driver1 = await this.userModel.create({
        email: driver1Email,
        password: hashedPassword,
        fullName: 'Thabo Mokoena',
        phoneNumber: '+27 73 987 6543',
        role: UserRole.DRIVER,
        ownerId: owner._id,
      });
      console.log('Created Driver 1: driver.thabo@fleetflow.co.za');
    }

    const driver2Email = 'driver.siphiwe@fleetflow.co.za';
    let driver2 = await this.userModel.findOne({ email: driver2Email });
    if (!driver2) {
      const hashedPassword = await bcrypt.hash('Driver123!', 10);
      driver2 = await this.userModel.create({
        email: driver2Email,
        password: hashedPassword,
        fullName: 'Siphiwe Cele',
        phoneNumber: '+27 84 555 1234',
        role: UserRole.DRIVER,
        ownerId: owner._id,
      });
      console.log('Created Driver 2: driver.siphiwe@fleetflow.co.za');
    }

    // 3. Create Vehicles
    let v1 = await this.vehicleModel.findOne({ registrationNumber: 'CA 489-102' });
    if (!v1) {
      v1 = await this.vehicleModel.create({
        make: 'Toyota',
        model: 'Corolla Quest',
        year: 2022,
        registrationNumber: 'CA 489-102',
        color: 'White',
        currentMileage: 94500,
        nextServiceMileage: 95000, // Service due within 500km!
        ownerId: owner._id,
        assignedDriverId: driver1._id,
      });
      console.log('Created Vehicle 1: Toyota Quest (CA 489-102)');
    }

    let v2 = await this.vehicleModel.findOne({ registrationNumber: 'GP 771-309' });
    if (!v2) {
      v2 = await this.vehicleModel.create({
        make: 'Nissan',
        model: 'Almera 1.5',
        year: 2023,
        registrationNumber: 'GP 771-309',
        color: 'Silver',
        currentMileage: 42000,
        nextServiceMileage: 50000,
        ownerId: owner._id,
        assignedDriverId: driver2._id,
      });
      console.log('Created Vehicle 2: Nissan Almera (GP 771-309)');
    }

    // 4. Set Check-In Rates
    const currentMonday = this.getMondayString(new Date());
    await this.checkInRateModel.findOneAndUpdate(
      { driverId: driver1._id, effectiveWeekStart: currentMonday },
      { ownerId: owner._id, weeklyAmount: 2200, effectiveWeekStart: currentMonday },
      { upsert: true },
    );
    await this.checkInRateModel.findOneAndUpdate(
      { driverId: driver2._id, effectiveWeekStart: currentMonday },
      { ownerId: owner._id, weeklyAmount: 2000, effectiveWeekStart: currentMonday },
      { upsert: true },
    );

    // 5. Create Sample Historical Settlement & Debt for Thabo
    const prevMonday = this.getMondayString(new Date(Date.now() - 7 * 24 * 3600 * 1000));
    const prevSunday = this.getSundayString(new Date(prevMonday));

    const existingSettlement = await this.settlementModel.findOne({
      driverId: driver1._id,
      weekStartDate: prevMonday,
    });

    if (!existingSettlement) {
      // Driver Thabo made R4000 gross previous week
      // Fixed Check-in R2200
      // Opening debt: R1200
      // Agreed debt repayment: R600 (out of R1200)
      // Net Payout: 4000 - 2200 - 600 = R1200
      // Closing carried over debt balance: R600
      await this.settlementModel.create({
        driverId: driver1._id,
        ownerId: owner._id,
        vehicleId: v1._id,
        weekStartDate: prevMonday,
        weekEndDate: prevSunday,
        uberGrossPayout: 4000,
        fixedCheckInAmount: 2200,
        openingDebtBalance: 1200,
        approvedAdvancesThisWeek: 0,
        totalDebtOwed: 1200,
        requestedDebtDeduction: 600,
        actualDebtDeducted: 600,
        netDriverPayout: 1200,
        closingDebtBalance: 600, // R600 debt carried over to current week!
        notes: 'Driver requested partial debt deduction of R600 instead of full R1200.',
      });
      console.log('Created Previous Week Settlement for Thabo (Carried Over Debt: R600)');
    }

    // 6. Create Advance Request for Thabo
    const existingAdvance = await this.advanceModel.findOne({ driverId: driver1._id, reason: 'Emergency Tire Replacement' });
    if (!existingAdvance) {
      await this.advanceModel.create({
        driverId: driver1._id,
        ownerId: owner._id,
        amount: 500,
        reason: 'Emergency Tire Replacement',
        status: AdvanceStatus.PENDING,
      });
      console.log('Created Pending Advance Request of R500 for Thabo');
    }

    console.log('--- FleetFlow Database Seeding Complete ---');
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
