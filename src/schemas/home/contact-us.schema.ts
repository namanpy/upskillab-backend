import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type ContactUsDocument = HydratedDocument<ContactUs> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class ContactUs {
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
  @Prop()
  number?: string; // Optional field

  @ApiProperty()
  @Prop({ required: true })
  subject: string;

  @ApiProperty()
  @Prop({ required: true })
  message: string;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);