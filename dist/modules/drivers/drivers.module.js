"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../../schemas/user.schema");
const vehicle_schema_1 = require("../../schemas/vehicle.schema");
const weekly_settlement_schema_1 = require("../../schemas/weekly-settlement.schema");
const advance_request_schema_1 = require("../../schemas/advance-request.schema");
const check_in_rate_schema_1 = require("../../schemas/check-in-rate.schema");
const drivers_service_1 = require("./drivers.service");
const drivers_controller_1 = require("./drivers.controller");
let DriversModule = class DriversModule {
};
exports.DriversModule = DriversModule;
exports.DriversModule = DriversModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: vehicle_schema_1.Vehicle.name, schema: vehicle_schema_1.VehicleSchema },
                { name: weekly_settlement_schema_1.WeeklySettlement.name, schema: weekly_settlement_schema_1.WeeklySettlementSchema },
                { name: advance_request_schema_1.AdvanceRequest.name, schema: advance_request_schema_1.AdvanceRequestSchema },
                { name: check_in_rate_schema_1.CheckInRate.name, schema: check_in_rate_schema_1.CheckInRateSchema },
            ]),
        ],
        controllers: [drivers_controller_1.DriversController],
        providers: [drivers_service_1.DriversService],
        exports: [drivers_service_1.DriversService],
    })
], DriversModule);
//# sourceMappingURL=drivers.module.js.map