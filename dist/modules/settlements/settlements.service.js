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
exports.SettlementsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const weekly_settlement_schema_1 = require("../../schemas/weekly-settlement.schema");
const user_schema_1 = require("../../schemas/user.schema");
const vehicle_schema_1 = require("../../schemas/vehicle.schema");
const check_in_rates_service_1 = require("../check-in-rates/check-in-rates.service");
const drivers_service_1 = require("../drivers/drivers.service");
let SettlementsService = class SettlementsService {
    constructor(settlementModel, userModel, vehicleModel, checkInRatesService, driversService) {
        this.settlementModel = settlementModel;
        this.userModel = userModel;
        this.vehicleModel = vehicleModel;
        this.checkInRatesService = checkInRatesService;
        this.driversService = driversService;
    }
    async calculatePreview(ownerId, dto) {
        const driver = await this.userModel.findById(dto.driverId);
        if (!driver || driver.role !== user_schema_1.UserRole.DRIVER) {
            throw new common_1.NotFoundException('Driver not found');
        }
        const vehicle = await this.vehicleModel.findOne({ assignedDriverId: dto.driverId });
        const weekStartDate = dto.weekStartDate
            ? this.getMondayString(new Date(dto.weekStartDate))
            : this.getMondayString(new Date());
        const weekEndDate = this.getSundayString(new Date(weekStartDate));
        const rateInfo = await this.checkInRatesService.getRateForDriver(dto.driverId, weekStartDate);
        const fixedCheckInAmount = rateInfo.weeklyAmount;
        const openingDebtBalance = await this.driversService.getDriverCurrentDebt(dto.driverId);
        const approvedAdvancesThisWeek = 0;
        const totalDebtOwed = openingDebtBalance + approvedAdvancesThisWeek;
        const uberGrossPayout = dto.uberGrossPayout;
        const requestedDeduction = dto.requestedDebtDeduction !== undefined ? dto.requestedDebtDeduction : totalDebtOwed;
        const maxAvailableForDebt = Math.max(0, uberGrossPayout - fixedCheckInAmount);
        const actualDebtDeducted = Math.min(requestedDeduction, totalDebtOwed, maxAvailableForDebt);
        const netDriverPayout = Math.max(0, uberGrossPayout - fixedCheckInAmount - actualDebtDeducted);
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
            closingDebtBalance,
        };
    }
    async createSettlement(ownerId, dto) {
        const preview = await this.calculatePreview(ownerId, dto);
        const existing = await this.settlementModel.findOne({
            driverId: dto.driverId,
            weekStartDate: preview.weekStartDate,
        });
        if (existing) {
            throw new common_1.BadRequestException(`A weekly settlement for week starting ${preview.weekStartDate} has already been recorded for this driver.`);
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
    async findAllForUser(user) {
        const filter = user.role === user_schema_1.UserRole.DRIVER ? { driverId: user._id } : { ownerId: user._id };
        return this.settlementModel
            .find(filter)
            .populate('driverId', 'fullName email phoneNumber')
            .populate('vehicleId', 'make model registrationNumber')
            .sort({ weekStartDate: -1 })
            .exec();
    }
    async getFinancialSummary(user) {
        const filter = user.role === user_schema_1.UserRole.DRIVER ? { driverId: user._id } : { ownerId: user._id };
        const settlements = await this.settlementModel.find(filter).exec();
        const now = new Date();
        const currentMonday = this.getMondayString(now);
        const currentMonth = now.toISOString().slice(0, 7);
        let currentWeekGross = 0;
        let currentWeekOwnerKeep = 0;
        let currentWeekDriverNet = 0;
        let monthGross = 0;
        let monthOwnerKeep = 0;
        let monthDriverNet = 0;
        let monthDebtCollected = 0;
        settlements.forEach((s) => {
            if (s.weekStartDate.startsWith(currentMonth)) {
                monthGross += s.uberGrossPayout;
                monthOwnerKeep += s.fixedCheckInAmount + s.actualDebtDeducted;
                monthDriverNet += s.netDriverPayout;
                monthDebtCollected += s.actualDebtDeducted;
            }
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
exports.SettlementsService = SettlementsService;
exports.SettlementsService = SettlementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(weekly_settlement_schema_1.WeeklySettlement.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(vehicle_schema_1.Vehicle.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        check_in_rates_service_1.CheckInRatesService,
        drivers_service_1.DriversService])
], SettlementsService);
//# sourceMappingURL=settlements.service.js.map