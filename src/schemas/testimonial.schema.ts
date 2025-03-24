import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TestimonialDocuments = HydratedDocument<Testimonial>;

@Schema()
export class Testimonial {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  rating: number;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
