/**
 * Reference - https://docs.nestjs.com/techniques/mongodb
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ResourceDocument = HydratedDocument<Resource> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Resource {
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
  @Prop()
  pdf?: string;

  @ApiProperty()
  @Prop()
  image?: string;

  @ApiProperty()
  @Prop()
  link?: string;

  @ApiProperty()
  @Prop({ default: false })
  isApproved: boolean;

  @ApiProperty({ type: [String] })
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);