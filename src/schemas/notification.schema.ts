import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  message: string;

  @Prop({ required: false })
  type: string; // e.g., 'ALERT', 'CLASS_CREATED'

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  recipient: Types.ObjectId;

  @Prop({
    required: true,
    enum: [
      'admin',
      'teacher',
      'student',
      'adminTeacher',
      'adminStudent',
      'teacherStudent',
    ],
  })
  role: string;

  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
