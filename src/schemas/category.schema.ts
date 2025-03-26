/**
 *
 * Reference - https://docs.nestjs.com/techniques/mongodb
 *
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CategoryDocuments = HydratedDocument<Category>;

@Schema()
export class Category {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
  })
  categoryName: string;

  @ApiProperty()
  @Prop({
    required: true,
    unique: true,
  })
  categoryCode: string;

  @ApiProperty()
  @Prop({
    required: true,
    default: true,
  })
  active: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
