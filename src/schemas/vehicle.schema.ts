import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true })
  make: string; // e.g. Toyota, Nissan, Hyundai

  @Prop({ required: true })
  model: string; // e.g. Quest, Almera, Grand i10

  @Prop({ required: true })
  year: number; // e.g. 2022

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  registrationNumber: string; // e.g. CA 123-456

  @Prop({ required: true })
  color: string; // e.g. White, Silver, Black

  @Prop({ required: true, default: 0 })
  currentMileage: number; // in km

  @Prop({ required: true, default: 10000 })
  nextServiceMileage: number; // target km for next service e.g. 100000 km

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false, default: null })
  assignedDriverId?: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
