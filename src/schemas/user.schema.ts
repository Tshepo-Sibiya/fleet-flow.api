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

  @Prop({ required: false })
  password?: string; // Optional during driver invitation pending phase

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: false, default: '' })
  companyName?: string; // Required for Fleet Owner

  @Prop({ required: false, default: '' })
  phoneNumber?: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.OWNER })
  role: UserRole;

  @Prop({ required: false, ref: 'User' })
  ownerId?: string; // For DRIVER role, reference to their Fleet Owner

  @Prop({ required: true, default: false })
  isConfirmed: boolean; // Must confirm email before login

  @Prop({ required: false, default: null })
  confirmationToken?: string;

  @Prop({ required: false, default: null })
  inviteToken?: string; // Sent in driver invite email

  @Prop({ required: true, default: false })
  isInvitePending: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
