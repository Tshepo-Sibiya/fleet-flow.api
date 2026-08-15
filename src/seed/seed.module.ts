import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { User, UserSchema } from '../schemas/user.schema';
import { Vehicle, VehicleSchema } from '../schemas/vehicle.schema';
import { CheckInRate, CheckInRateSchema } from '../schemas/check-in-rate.schema';
import { AdvanceRequest, AdvanceRequestSchema } from '../schemas/advance-request.schema';
import { WeeklySettlement, WeeklySettlementSchema } from '../schemas/weekly-settlement.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: CheckInRate.name, schema: CheckInRateSchema },
      { name: AdvanceRequest.name, schema: AdvanceRequestSchema },
      { name: WeeklySettlement.name, schema: WeeklySettlementSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
