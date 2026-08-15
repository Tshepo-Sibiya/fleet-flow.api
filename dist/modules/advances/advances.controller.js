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
exports.AdvancesController = void 0;
const common_1 = require("@nestjs/common");
const advances_service_1 = require("./advances.service");
const advance_dto_1 = require("./dto/advance.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let AdvancesController = class AdvancesController {
    constructor(advancesService) {
        this.advancesService = advancesService;
    }
    async create(req, dto) {
        return this.advancesService.createRequest(req.user._id, dto);
    }
    async findAll(req) {
        return this.advancesService.findAllForUser(req.user);
    }
    async updateStatus(req, id, dto) {
        return this.advancesService.updateStatus(id, req.user._id, dto);
    }
};
exports.AdvancesController = AdvancesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, advance_dto_1.CreateAdvanceRequestDto]),
    __metadata("design:returntype", Promise)
], AdvancesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdvancesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, advance_dto_1.UpdateAdvanceStatusDto]),
    __metadata("design:returntype", Promise)
], AdvancesController.prototype, "updateStatus", null);
exports.AdvancesController = AdvancesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('advances'),
    __metadata("design:paramtypes", [advances_service_1.AdvancesService])
], AdvancesController);
//# sourceMappingURL=advances.controller.js.map