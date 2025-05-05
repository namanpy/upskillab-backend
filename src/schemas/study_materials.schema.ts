import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type StudyMaterialDocument = HydratedDocument<StudyMaterial> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class StudyMaterial {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  fileLink: string;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'Chapter', required: true })
  chapter: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacher: Types.ObjectId;
}

export const StudyMaterialSchema = SchemaFactory.createForClass(StudyMaterial);
