import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WeeklySettlementDocument = WeeklySettlement & Document;

@Schema({ timestamps: true })
export class WeeklySettlement {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  driverId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: false })
  vehicleId?: string;

  @Prop({ required: true })
  weekStartDate: string; // "YYYY-MM-DD" Monday

  @Prop({ required: true })
  weekEndDate: string; // "YYYY-MM-DD" Sunday

  @Prop({ required: true, min: 0 })
  uberGrossPayout: number; // e.g. 5000

  @Prop({ required: true, min: 0 })
  fixedCheckInAmount: number; // e.g. 2200

  @Prop({ required: true, default: 0 })
  openingDebtBalance: number; // e.g. 600

  @Prop({ required: true, default: 0 })
  approvedAdvancesThisWeek: number; // e.g. 0

  @Prop({ required: true, default: 0 })
  totalDebtOwed: number; // openingDebtBalance + approvedAdvancesThisWeek e.g. 600

  @Prop({ required: true, default: 0 })
  requestedDebtDeduction: number; // e.g. 300 (agreed deduction)

  @Prop({ required: true, default: 0 })
  actualDebtDeducted: number; // e.g. 300

  @Prop({ required: true })
  netDriverPayout: number; // e.g. 2500

  @Prop({ required: true, default: 0 })
  closingDebtBalance: number; // e.g. 300 (carried forward to next week)

  @Prop({ required: false, default: '' })
  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const WeeklySettlementSchema = SchemaFactory.createForClass(WeeklySettlement);
WeeklySettlementSchema.index({ driverId: 1, weekStartDate: 1 }, { unique: true });
