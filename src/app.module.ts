import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { CheckInRatesModule } from './modules/check-in-rates/check-in-rates.module';
import { AdvancesModule } from './modules/advances/advances.module';
import { SettlementsModule } from './modules/settlements/settlements.module';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    VehiclesModule,
    DriversModule,
    CheckInRatesModule,
    AdvancesModule,
    SettlementsModule,
    SeedModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    try {
      await this.seedService.seed();
    } catch (err) {
      console.warn('Auto-seed check failed or skipped:', err.message);
    }
  }
}
