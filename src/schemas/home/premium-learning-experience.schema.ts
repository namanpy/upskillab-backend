import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type PremiumLearningExperienceDocument = HydratedDocument<PremiumLearningExperience> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class PremiumLearningExperience {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  // @ApiProperty()
  // @Prop({ required: true })
  // description: string;

  @ApiProperty()
  @Prop({ required: true })
  imageUrl: string;

  @ApiProperty()
  @Prop({ default: true })
  active: boolean;
}

export const PremiumLearningExperienceSchema = SchemaFactory.createForClass(PremiumLearningExperience);