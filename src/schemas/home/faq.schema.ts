/**
 * Reference - https://docs.nestjs.com/techniques/mongodb
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type FAQDocument = HydratedDocument<FAQ> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class FAQ {
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
}

export const FAQSchema = SchemaFactory.createForClass(FAQ);