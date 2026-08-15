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
exports.CheckInRatesController = void 0;
const common_1 = require("@nestjs/common");
const check_in_rates_service_1 = require("./check-in-rates.service");
const check_in_rate_dto_1 = require("./dto/check-in-rate.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CheckInRatesController = class CheckInRatesController {
    constructor(checkInRatesService) {
        this.checkInRatesService = checkInRatesService;
    }
    async setRate(req, dto) {
        return this.checkInRatesService.setRate(req.user._id, dto);
    }
    async getRateForDriver(driverId, weekStartDate) {
        return this.checkInRatesService.getRateForDriver(driverId, weekStartDate);
    }
};
exports.CheckInRatesController = CheckInRatesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, check_in_rate_dto_1.SetCheckInRateDto]),
    __metadata("design:returntype", Promise)
], CheckInRatesController.prototype, "setRate", null);
__decorate([
    (0, common_1.Get)('driver/:driverId'),
    __param(0, (0, common_1.Param)('driverId')),
    __param(1, (0, common_1.Query)('weekStartDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CheckInRatesController.prototype, "getRateForDriver", null);
exports.CheckInRatesController = CheckInRatesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('check-in-rates'),
    __metadata("design:paramtypes", [check_in_rates_service_1.CheckInRatesService])
], CheckInRatesController);
//# sourceMappingURL=check-in-rates.controller.js.map