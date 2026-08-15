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
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../schemas/user.schema");
const vehicle_schema_1 = require("../../schemas/vehicle.schema");
const weekly_settlement_schema_1 = require("../../schemas/weekly-settlement.schema");
const advance_request_schema_1 = require("../../schemas/advance-request.schema");
const check_in_rate_schema_1 = require("../../schemas/check-in-rate.schema");
const bcrypt = require("bcrypt");
let DriversService = class DriversService {
    constructor(userModel, vehicleModel, settlementModel, advanceModel, checkInRateModel) {
        this.userModel = userModel;
        this.vehicleModel = vehicleModel;
        this.settlementModel = settlementModel;
        this.advanceModel = advanceModel;
        this.checkInRateModel = checkInRateModel;
    }
    async createDriver(ownerId, data) {
        const existing = await this.userModel.findOne({ email: data.email.toLowerCase() });
        if (existing) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const defaultPassword = data.password || 'Driver123!';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const driver = await this.userModel.create({
            email: data.email.toLowerCase(),
            password: hashedPassword,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber || '',
            role: user_schema_1.UserRole.DRIVER,
            ownerId,
        });
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
    async findAllForOwner(ownerId) {
        const drivers = await this.userModel.find({ ownerId, role: user_schema_1.UserRole.DRIVER }).select('-password').exec();
        const result = await Promise.all(drivers.map(async (driver) => {
            const vehicle = await this.vehicleModel.findOne({ assignedDriverId: driver._id }).exec();
            const currentDebt = await this.getDriverCurrentDebt(driver._id.toString());
            const currentRate = await this.getDriverCurrentCheckInRate(driver._id.toString());
            return {
                ...driver.toObject(),
                assignedVehicle: vehicle || null,
                currentDebtBalance: currentDebt,
                weeklyCheckInAmount: currentRate,
            };
        }));
        return result;
    }
    async getDriverDetails(driverId) {
        const driver = await this.userModel.findById(driverId).select('-password').exec();
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
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
    async getDriverCurrentDebt(driverId) {
        const latestSettlement = await this.settlementModel
            .findOne({ driverId })
            .sort({ weekStartDate: -1 })
            .exec();
        let baseDebt = 0;
        let baseDate = null;
        if (latestSettlement) {
            baseDebt = latestSettlement.closingDebtBalance;
            baseDate = new Date(latestSettlement.createdAt);
        }
        const query = {
            driverId,
            status: advance_request_schema_1.AdvanceStatus.APPROVED,
        };
        if (baseDate) {
            query.createdAt = { $gt: baseDate };
        }
        const approvedAdvances = await this.advanceModel.find(query).exec();
        const advancesSum = approvedAdvances.reduce((acc, curr) => acc + curr.amount, 0);
        return baseDebt + advancesSum;
    }
    async getDriverCurrentCheckInRate(driverId) {
        const today = new Date();
        const mondayStr = this.getMondayString(today);
        const rateDoc = await this.checkInRateModel
            .findOne({ driverId, effectiveWeekStart: { $lte: mondayStr } })
            .sort({ effectiveWeekStart: -1 })
            .exec();
        return rateDoc ? rateDoc.weeklyAmount : 2200;
    }
    getMondayString(d) {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        return monday.toISOString().split('T')[0];
    }
};
exports.DriversService = DriversService;
exports.DriversService = DriversService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(vehicle_schema_1.Vehicle.name)),
    __param(2, (0, mongoose_1.InjectModel)(weekly_settlement_schema_1.WeeklySettlement.name)),
    __param(3, (0, mongoose_1.InjectModel)(advance_request_schema_1.AdvanceRequest.name)),
    __param(4, (0, mongoose_1.InjectModel)(check_in_rate_schema_1.CheckInRate.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DriversService);
//# sourceMappingURL=drivers.service.js.map