import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UniversityCourse2Document = HydratedDocument<UniversityCourse2>;

@Schema({ timestamps: true })
export class UniversityCourse2 {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty({ enum: ['beginner', 'intermediate', 'expert'], enumName: 'FieldLevel' })
  @Prop({ required: true, enum: ['beginner', 'intermediate', 'expert'] })
  fieldLevel: string;

  @ApiProperty()
  @Prop({ required: true })
  imageUrl: string;

  @ApiProperty()
  @Prop({ required: true, default: true })
  active: boolean;

  @ApiProperty()
  @Prop({ required: true })
  totalPrice: number;

  @ApiProperty()
  @Prop({ required: true })
  discountedPrice: number;

  @ApiProperty()
  @Prop()
  createdAt: Date;

  @ApiProperty()
  @Prop()
  updatedAt: Date;
}

export const UniversityCourse2Schema = SchemaFactory.createForClass(UniversityCourse2);