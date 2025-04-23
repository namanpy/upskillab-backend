import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type LoginAttemptDocument = HydratedDocument<LoginAttempt> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class LoginAttempt {
  @ApiProperty({ type: Number })
  @Prop({ required: true })
  otpCode: number;

  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
}

export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt);
