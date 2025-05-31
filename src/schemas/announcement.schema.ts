import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnnouncementDocument = Announcement & Document;

@Schema({ timestamps: true })
export class Announcement {
  @Prop({ required: true })
  message: string;

  @Prop({ required: false, default: false })
  isActive: boolean;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
