import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type Banner3Document = HydratedDocument<Banner3> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Banner3 {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  imageUrl: string;

  @ApiProperty()
  @Prop({ default: true })
  active: boolean;
}

export const Banner3Schema = SchemaFactory.createForClass(Banner3);