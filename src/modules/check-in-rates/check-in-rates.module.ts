import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckInRate, CheckInRateSchema } from '../../schemas/check-in-rate.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { CheckInRatesService } from './check-in-rates.service';
import { CheckInRatesController } from './check-in-rates.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CheckInRate.name, schema: CheckInRateSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CheckInRatesController],
  providers: [CheckInRatesService],
  exports: [CheckInRatesService],
})
export class CheckInRatesModule {}
