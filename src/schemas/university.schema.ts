import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type UniversityDocument = HydratedDocument<University> & {
  createdAt?: Date;
  updatedAt?: Date;
};

@Schema({ timestamps: true })
export class University {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  institutionType: string;

  @ApiProperty()
  @Prop({ required: true })
  deliveryMode: string;

  @ApiProperty()
  @Prop({ required: true })
  programType: string[];

  @ApiProperty()
  @Prop({ required: true })
  ratings: number;

  @ApiProperty()
  @Prop({ required: true })
  reviews: number;

  @ApiProperty()
  @Prop({ required: true, default: false })
  certification: boolean;

  @ApiProperty()
  @Prop({ required: true })
  imageUrl: string;

  // Explicitly declare timestamps as optional (though Mongoose handles them)
  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}

export const UniversitySchema = SchemaFactory.createForClass(University);