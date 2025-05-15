import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'Doubt', required: true })
  doubt: Types.ObjectId;

  @Prop({ type: [String], default: [] }) // Array of file URLs
  attachments: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
