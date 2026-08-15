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
exports.CheckInRatesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const check_in_rate_schema_1 = require("../../schemas/check-in-rate.schema");
const user_schema_1 = require("../../schemas/user.schema");
let CheckInRatesService = class CheckInRatesService {
    constructor(checkInRateModel, userModel) {
        this.checkInRateModel = checkInRateModel;
        this.userModel = userModel;
    }
    async setRate(ownerId, dto) {
        const driver = await this.userModel.findById(dto.driverId);
        if (!driver || driver.role !== user_schema_1.UserRole.DRIVER) {
            throw new common_1.NotFoundException('Driver not found');
        }
        const currentMondayStr = this.getMondayString(new Date());
        const targetMondayStr = this.getMondayString(new Date(dto.effectiveWeekStart));
        if (targetMondayStr <= currentMondayStr) {
            throw new common_1.BadRequestException(`Weekly check-in rate for current or past week (${targetMondayStr}) is locked and cannot be modified once the week has started.`);
        }
        const rate = await this.checkInRateModel.findOneAndUpdate({ driverId: dto.driverId, effectiveWeekStart: targetMondayStr }, {
            ownerId,
            weeklyAmount: dto.weeklyAmount,
            effectiveWeekStart: targetMondayStr,
        }, { upsert: true, new: true });
        return rate;
    }
    async getRateForDriver(driverId, weekStartDate) {
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
            weeklyAmount: rateDoc ? rateDoc.weeklyAmount : 2200,
            isLocked: mondayStr <= this.getMondayString(new Date()),
        };
    }
    getMondayString(d) {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        return monday.toISOString().split('T')[0];
    }
};
exports.CheckInRatesService = CheckInRatesService;
exports.CheckInRatesService = CheckInRatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(check_in_rate_schema_1.CheckInRate.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CheckInRatesService);
//# sourceMappingURL=check-in-rates.service.js.map