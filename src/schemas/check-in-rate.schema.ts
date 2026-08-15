import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CheckInRateDocument = CheckInRate & Document;

@Schema({ timestamps: true })
export class CheckInRate {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  driverId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: string;

  @Prop({ required: true, min: 0 })
  weeklyAmount: number; // e.g. 2200

  @Prop({ required: true })
  effectiveWeekStart: string; // ISO date string for Monday of the effective week "YYYY-MM-DD"
}

export const CheckInRateSchema = SchemaFactory.createForClass(CheckInRate);
CheckInRateSchema.index({ driverId: 1, effectiveWeekStart: 1 }, { unique: true });
