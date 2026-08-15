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
exports.AdvancesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const advance_request_schema_1 = require("../../schemas/advance-request.schema");
const user_schema_1 = require("../../schemas/user.schema");
let AdvancesService = class AdvancesService {
    constructor(advanceModel, userModel) {
        this.advanceModel = advanceModel;
        this.userModel = userModel;
    }
    async createRequest(driverId, dto) {
        const driver = await this.userModel.findById(driverId);
        if (!driver || driver.role !== user_schema_1.UserRole.DRIVER) {
            throw new common_1.BadRequestException('Invalid driver user');
        }
        if (!driver.ownerId) {
            throw new common_1.BadRequestException('Driver is not linked to a Fleet Owner yet');
        }
        const advance = await this.advanceModel.create({
            driverId,
            ownerId: driver.ownerId,
            amount: dto.amount,
            reason: dto.reason,
            status: advance_request_schema_1.AdvanceStatus.PENDING,
        });
        return this.advanceModel
            .findById(advance._id)
            .populate('driverId', 'fullName email phoneNumber')
            .populate('ownerId', 'fullName email')
            .exec();
    }
    async findAllForUser(user) {
        if (user.role === user_schema_1.UserRole.DRIVER) {
            return this.advanceModel
                .find({ driverId: user._id })
                .populate('ownerId', 'fullName email')
                .sort({ createdAt: -1 })
                .exec();
        }
        return this.advanceModel
            .find({ ownerId: user._id })
            .populate('driverId', 'fullName email phoneNumber')
            .sort({ createdAt: -1 })
            .exec();
    }
    async updateStatus(id, ownerId, dto) {
        const advance = await this.advanceModel.findOne({ _id: id, ownerId });
        if (!advance) {
            throw new common_1.NotFoundException('Advance request not found');
        }
        if (advance.status !== advance_request_schema_1.AdvanceStatus.PENDING) {
            throw new common_1.BadRequestException(`Advance request is already ${advance.status}`);
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
            .populate('ownerId', 'fullName email')
            .exec();
    }
};
exports.AdvancesService = AdvancesService;
exports.AdvancesService = AdvancesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(advance_request_schema_1.AdvanceRequest.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AdvancesService);
//# sourceMappingURL=advances.service.js.map