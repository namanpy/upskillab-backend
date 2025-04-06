import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type YoutubeVideoDocument = HydratedDocument<YoutubeVideo> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class YoutubeVideo {
  @Prop({ required: true, unique: true })
  videoId: string;

  @Prop({ default: true })
  active: boolean;
}

export const YoutubeVideoSchema = SchemaFactory.createForClass(YoutubeVideo);
