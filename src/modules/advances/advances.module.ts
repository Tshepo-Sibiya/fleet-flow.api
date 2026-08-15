import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdvanceRequest, AdvanceRequestSchema } from '../../schemas/advance-request.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { AdvancesService } from './advances.service';
import { AdvancesController } from './advances.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdvanceRequest.name, schema: AdvanceRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdvancesController],
  providers: [AdvancesService],
  exports: [AdvancesService],
})
export class AdvancesModule {}
