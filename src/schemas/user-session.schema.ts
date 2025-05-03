import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type UserSessionDocument = UserSession & Document;

@Schema({ timestamps: true })
export class UserSession {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true, expires: 2592000 })
  expiresAt: Date;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
