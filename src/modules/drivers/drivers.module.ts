import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { Vehicle, VehicleSchema } from '../../schemas/vehicle.schema';
import { WeeklySettlement, WeeklySettlementSchema } from '../../schemas/weekly-settlement.schema';
import { AdvanceRequest, AdvanceRequestSchema } from '../../schemas/advance-request.schema';
import { CheckInRate, CheckInRateSchema } from '../../schemas/check-in-rate.schema';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: WeeklySettlement.name, schema: WeeklySettlementSchema },
      { name: AdvanceRequest.name, schema: AdvanceRequestSchema },
      { name: CheckInRate.name, schema: CheckInRateSchema },
    ]),
  ],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {}
