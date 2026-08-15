"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const weekly_settlement_schema_1 = require("../../schemas/weekly-settlement.schema");
const user_schema_1 = require("../../schemas/user.schema");
const vehicle_schema_1 = require("../../schemas/vehicle.schema");
const check_in_rates_module_1 = require("../check-in-rates/check-in-rates.module");
const drivers_module_1 = require("../drivers/drivers.module");
const settlements_service_1 = require("./settlements.service");
const settlements_controller_1 = require("./settlements.controller");
let SettlementsModule = class SettlementsModule {
};
exports.SettlementsModule = SettlementsModule;
exports.SettlementsModule = SettlementsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: weekly_settlement_schema_1.WeeklySettlement.name, schema: weekly_settlement_schema_1.WeeklySettlementSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: vehicle_schema_1.Vehicle.name, schema: vehicle_schema_1.VehicleSchema },
            ]),
            check_in_rates_module_1.CheckInRatesModule,
            drivers_module_1.DriversModule,
        ],
        controllers: [settlements_controller_1.SettlementsController],
        providers: [settlements_service_1.SettlementsService],
        exports: [settlements_service_1.SettlementsService],
    })
], SettlementsModule);
//# sourceMappingURL=settlements.module.js.map