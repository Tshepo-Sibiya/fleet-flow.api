"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const database_module_1 = require("../database/database.module");
const user_schema_1 = require("../schemas/user.schema");
const vehicle_schema_1 = require("../schemas/vehicle.schema");
const check_in_rate_schema_1 = require("../schemas/check-in-rate.schema");
const advance_request_schema_1 = require("../schemas/advance-request.schema");
const weekly_settlement_schema_1 = require("../schemas/weekly-settlement.schema");
const seed_service_1 = require("./seed.service");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: vehicle_schema_1.Vehicle.name, schema: vehicle_schema_1.VehicleSchema },
                { name: check_in_rate_schema_1.CheckInRate.name, schema: check_in_rate_schema_1.CheckInRateSchema },
                { name: advance_request_schema_1.AdvanceRequest.name, schema: advance_request_schema_1.AdvanceRequestSchema },
                { name: weekly_settlement_schema_1.WeeklySettlement.name, schema: weekly_settlement_schema_1.WeeklySettlementSchema },
            ]),
        ],
        providers: [seed_service_1.SeedService],
        exports: [seed_service_1.SeedService],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map