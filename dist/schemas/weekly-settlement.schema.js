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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeeklySettlementSchema = exports.WeeklySettlement = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let WeeklySettlement = class WeeklySettlement {
};
exports.WeeklySettlement = WeeklySettlement;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], WeeklySettlement.prototype, "driverId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], WeeklySettlement.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Vehicle', required: false }),
    __metadata("design:type", String)
], WeeklySettlement.prototype, "vehicleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WeeklySettlement.prototype, "weekStartDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WeeklySettlement.prototype, "weekEndDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], WeeklySettlement.prototype, "uberGrossPayout", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], WeeklySettlement.prototype, "fixedCheckInAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], WeeklySettlement.prototype, "openingDebtBalance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], WeeklySettlement.prototype, "approvedAdvancesThisWeek", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], WeeklySettlement.prototype, "totalDebtOwed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], WeeklySettlement.prototype, "requestedDebtDeduction", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], WeeklySettlement.prototype, "actualDebtDeducted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeeklySettlement.prototype, "netDriverPayout", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], WeeklySettlement.prototype, "closingDebtBalance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: '' }),
    __metadata("design:type", String)
], WeeklySettlement.prototype, "notes", void 0);
exports.WeeklySettlement = WeeklySettlement = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], WeeklySettlement);
exports.WeeklySettlementSchema = mongoose_1.SchemaFactory.createForClass(WeeklySettlement);
exports.WeeklySettlementSchema.index({ driverId: 1, weekStartDate: 1 }, { unique: true });
//# sourceMappingURL=weekly-settlement.schema.js.map