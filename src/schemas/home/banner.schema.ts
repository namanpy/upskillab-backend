import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type BannerDocument = HydratedDocument<Banner> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Banner {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ required: true })
  imageUrl: string;

  @ApiProperty()
  @Prop({ default: false })
  active: boolean;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);