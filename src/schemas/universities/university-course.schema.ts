import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { UniversityModule, UniversityModuleSchema } from './university.module.schema'; // Import Module schema

export type UniversityCourseDocument = HydratedDocument<UniversityCourse> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class UniversityCourse {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'University2', required: true }) // Links to University2
  universityId: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  courseName: string;

  @ApiProperty()
  @Prop({ type: [UniversityModuleSchema], default: [] }) // Array of modules
  modules: UniversityModule[];

  @ApiProperty()
  @Prop({ type: Boolean, default: true }) // Add active field
  active: boolean;
}

export const UniversityCourseSchema = SchemaFactory.createForClass(UniversityCourse);