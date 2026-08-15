"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("../schemas/user.schema");
const vehicle_schema_1 = require("../schemas/vehicle.schema");
const check_in_rate_schema_1 = require("../schemas/check-in-rate.schema");
const advance_request_schema_1 = require("../schemas/advance-request.schema");
const weekly_settlement_schema_1 = require("../schemas/weekly-settlement.schema");
let SeedService = class SeedService {
    constructor(userModel, vehicleModel, checkInRateModel, advanceModel, settlementModel) {
        this.userModel = userModel;
        this.vehicleModel = vehicleModel;
        this.checkInRateModel = checkInRateModel;
        this.advanceModel = advanceModel;
        this.settlementModel = settlementModel;
    }
    async seed() {
        console.log('--- Starting FleetFlow Database Seeding ---');
        const ownerEmail = 'owner@fleetflow.co.za';
        let owner = await this.userModel.findOne({ email: ownerEmail });
        if (!owner) {
            const hashedPassword = await bcrypt.hash('Owner123!', 10);
            owner = await this.userModel.create({
                email: ownerEmail,
                password: hashedPassword,
                fullName: 'Sipho Nkosi (Fleet Owner)',
                phoneNumber: '+27 82 123 4567',
                role: user_schema_1.UserRole.OWNER,
            });
            console.log('Created Fleet Owner: owner@fleetflow.co.za');
        }
        const driver1Email = 'driver.thabo@fleetflow.co.za';
        let driver1 = await this.userModel.findOne({ email: driver1Email });
        if (!driver1) {
            const hashedPassword = await bcrypt.hash('Driver123!', 10);
            driver1 = await this.userModel.create({
                email: driver1Email,
                password: hashedPassword,
                fullName: 'Thabo Mokoena',
                phoneNumber: '+27 73 987 6543',
                role: user_schema_1.UserRole.DRIVER,
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
                role: user_schema_1.UserRole.DRIVER,
                ownerId: owner._id,
            });
            console.log('Created Driver 2: driver.siphiwe@fleetflow.co.za');
        }
        let v1 = await this.vehicleModel.findOne({ registrationNumber: 'CA 489-102' });
        if (!v1) {
            v1 = await this.vehicleModel.create({
                make: 'Toyota',
                model: 'Corolla Quest',
                year: 2022,
                registrationNumber: 'CA 489-102',
                color: 'White',
                currentMileage: 94500,
                nextServiceMileage: 95000,
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
        const currentMonday = this.getMondayString(new Date());
        await this.checkInRateModel.findOneAndUpdate({ driverId: driver1._id, effectiveWeekStart: currentMonday }, { ownerId: owner._id, weeklyAmount: 2200, effectiveWeekStart: currentMonday }, { upsert: true });
        await this.checkInRateModel.findOneAndUpdate({ driverId: driver2._id, effectiveWeekStart: currentMonday }, { ownerId: owner._id, weeklyAmount: 2000, effectiveWeekStart: currentMonday }, { upsert: true });
        const prevMonday = this.getMondayString(new Date(Date.now() - 7 * 24 * 3600 * 1000));
        const prevSunday = this.getSundayString(new Date(prevMonday));
        const existingSettlement = await this.settlementModel.findOne({
            driverId: driver1._id,
            weekStartDate: prevMonday,
        });
        if (!existingSettlement) {
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
                closingDebtBalance: 600,
                notes: 'Driver requested partial debt deduction of R600 instead of full R1200.',
            });
            console.log('Created Previous Week Settlement for Thabo (Carried Over Debt: R600)');
        }
        const existingAdvance = await this.advanceModel.findOne({ driverId: driver1._id, reason: 'Emergency Tire Replacement' });
        if (!existingAdvance) {
            await this.advanceModel.create({
                driverId: driver1._id,
                ownerId: owner._id,
                amount: 500,
                reason: 'Emergency Tire Replacement',
                status: advance_request_schema_1.AdvanceStatus.PENDING,
            });
            console.log('Created Pending Advance Request of R500 for Thabo');
        }
        console.log('--- FleetFlow Database Seeding Complete ---');
    }
    getMondayString(d) {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        return monday.toISOString().split('T')[0];
    }
    getSundayString(mondayDate) {
        const sunday = new Date(mondayDate);
        sunday.setDate(sunday.getDate() + 6);
        return sunday.toISOString().split('T')[0];
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(vehicle_schema_1.Vehicle.name)),
    __param(2, (0, mongoose_1.InjectModel)(check_in_rate_schema_1.CheckInRate.name)),
    __param(3, (0, mongoose_1.InjectModel)(advance_request_schema_1.AdvanceRequest.name)),
    __param(4, (0, mongoose_1.InjectModel)(weekly_settlement_schema_1.WeeklySettlement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SeedService);
//# sourceMappingURL=seed.service.js.map