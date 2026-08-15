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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const vehicles_module_1 = require("./modules/vehicles/vehicles.module");
const drivers_module_1 = require("./modules/drivers/drivers.module");
const check_in_rates_module_1 = require("./modules/check-in-rates/check-in-rates.module");
const advances_module_1 = require("./modules/advances/advances.module");
const settlements_module_1 = require("./modules/settlements/settlements.module");
const seed_module_1 = require("./seed/seed.module");
const seed_service_1 = require("./seed/seed.service");
let AppModule = class AppModule {
    constructor(seedService) {
        this.seedService = seedService;
    }
    async onModuleInit() {
        try {
            await this.seedService.seed();
        }
        catch (err) {
            console.warn('Auto-seed check failed or skipped:', err.message);
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            vehicles_module_1.VehiclesModule,
            drivers_module_1.DriversModule,
            check_in_rates_module_1.CheckInRatesModule,
            advances_module_1.AdvancesModule,
            settlements_module_1.SettlementsModule,
            seed_module_1.SeedModule,
        ],
    }),
    __metadata("design:paramtypes", [seed_service_1.SeedService])
], AppModule);
//# sourceMappingURL=app.module.js.map