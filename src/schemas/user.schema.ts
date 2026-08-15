import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  OWNER = 'OWNER',
  DRIVER = 'DRIVER',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: false, default: '' })
  phoneNumber: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.OWNER })
  role: UserRole;

  @Prop({ required: false, ref: 'User' })
  ownerId?: string; // For DRIVER role, reference to their Fleet Owner
}

export const UserSchema = SchemaFactory.createForClass(User);
