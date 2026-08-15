import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AdvanceRequestDocument = AdvanceRequest & Document;

export enum AdvanceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum AdvanceType {
  REGULAR_ADVANCE = 'REGULAR_ADVANCE',
  EARLY_CASHOUT = 'EARLY_CASHOUT',
}

@Schema({ timestamps: true })
export class AdvanceRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  driverId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: string;

  @Prop({ required: true, min: 1 })
  amount: number;

  @Prop({ required: true, trim: true })
  reason: string;

  @Prop({ required: true, enum: AdvanceType, default: AdvanceType.REGULAR_ADVANCE })
  type: AdvanceType;

  @Prop({ required: true, enum: AdvanceStatus, default: AdvanceStatus.PENDING })
  status: AdvanceStatus;

  @Prop({ required: false })
  reviewedAt?: Date;

  @Prop({ required: false, default: '' })
  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const AdvanceRequestSchema = SchemaFactory.createForClass(AdvanceRequest);
