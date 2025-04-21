import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type University2Document = HydratedDocument<University2> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class University2 {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  imageUrl: string;

  @ApiProperty()
  @Prop({ required: true })
  logoUrl: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  aboutTitle: string;

  @ApiProperty()
  @Prop({ required: true })
  aboutDescription: string;

  @ApiProperty()
  @Prop({ required: false })
  pageLink: string;

  @ApiProperty()
  @Prop({ type: [String], required: true })
  tags: string[];

  @ApiProperty()
  @Prop({ type: Boolean, default: true })
  active: boolean;
}

export const University2Schema = SchemaFactory.createForClass(University2);