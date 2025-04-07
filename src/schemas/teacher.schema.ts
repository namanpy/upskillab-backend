import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type TeacherDocument = HydratedDocument<Teacher> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Teacher {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  qualification: string;

  @ApiProperty()
  @Prop({ required: true })
  expertise: string;

  @ApiProperty()
  @Prop({ type: Object, default: {} })
  social_links: Record<string, string>;

  @ApiProperty()
  @Prop()
  bio: string;

  @ApiProperty()
  @Prop()
  experience: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
