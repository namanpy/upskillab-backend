import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { VIDEO_STATUS } from '../common/constants/recorded-video.constants';

export type RecordedVideoDocument = HydratedDocument<RecordedVideo> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class RecordedVideo {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  videoUrl: string;

  @ApiProperty()
  @Prop({ required: true })
  duration: string; // e.g., "01:30:00"

  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true })
  chapterId: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;

  @ApiProperty({ enum: VIDEO_STATUS })
  @Prop({ required: true, enum: VIDEO_STATUS, default: VIDEO_STATUS.PENDING })
  status: string;

  @ApiProperty()
  @Prop({ default: false })
  isPublic: boolean;
}

export const RecordedVideoSchema = SchemaFactory.createForClass(RecordedVideo);