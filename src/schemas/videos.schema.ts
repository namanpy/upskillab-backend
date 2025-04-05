import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type VideoDocument = HydratedDocument<Video> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Video {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  urls: string;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'course', required: true })
  course: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'Chapter', required: true })
  chapter: Types.ObjectId;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
