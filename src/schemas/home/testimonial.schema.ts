/**
 * Reference - https://docs.nestjs.com/techniques/mongodb
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type TestimonialDocument = HydratedDocument<Testimonial> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema()
export class SocialMediaLink {
  @ApiProperty()
  @Prop({ required: true })
  platform: string; // e.g., "LinkedIn", "Twitter"

  @ApiProperty()
  @Prop({ required: true })
  url: string; // e.g., "https://linkedin.com/in/username"
}

@Schema({ timestamps: true })
export class Testimonial {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty({ type: [SocialMediaLink] })
  @Prop({ type: [SocialMediaLink], default: [] })
  socialMediaLinks: SocialMediaLink[];
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);