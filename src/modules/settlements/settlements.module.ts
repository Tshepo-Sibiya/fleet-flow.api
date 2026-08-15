import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeeklySettlement, WeeklySettlementSchema } from '../../schemas/weekly-settlement.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { Vehicle, VehicleSchema } from '../../schemas/vehicle.schema';
import { CheckInRatesModule } from '../check-in-rates/check-in-rates.module';
import { DriversModule } from '../drivers/drivers.module';
import { SettlementsService } from './settlements.service';
import { SettlementsController } from './settlements.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeeklySettlement.name, schema: WeeklySettlementSchema },
      { name: User.name, schema: UserSchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
    CheckInRatesModule,
    DriversModule,
  ],
  controllers: [SettlementsController],
  providers: [SettlementsService],
  exports: [SettlementsService],
})
export class SettlementsModule {}
