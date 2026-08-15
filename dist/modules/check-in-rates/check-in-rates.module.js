"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInRatesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const check_in_rate_schema_1 = require("../../schemas/check-in-rate.schema");
const user_schema_1 = require("../../schemas/user.schema");
const check_in_rates_service_1 = require("./check-in-rates.service");
const check_in_rates_controller_1 = require("./check-in-rates.controller");
let CheckInRatesModule = class CheckInRatesModule {
};
exports.CheckInRatesModule = CheckInRatesModule;
exports.CheckInRatesModule = CheckInRatesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: check_in_rate_schema_1.CheckInRate.name, schema: check_in_rate_schema_1.CheckInRateSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        controllers: [check_in_rates_controller_1.CheckInRatesController],
        providers: [check_in_rates_service_1.CheckInRatesService],
        exports: [check_in_rates_service_1.CheckInRatesService],
    })
], CheckInRatesModule);
//# sourceMappingURL=check-in-rates.module.js.map