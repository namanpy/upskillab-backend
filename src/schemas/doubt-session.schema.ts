import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Course } from './course/course.schema';
import { Teacher } from './teacher.schema';

export type DoubtDocument = HydratedDocument<Doubt>;
export type MessageDocument = HydratedDocument<DoubtMessage>;

@Schema()
export class DoubtMessage {
  @ApiProperty({ type: String })
  @Prop({ required: true, ref: User.name })
  user: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: false })
  message: string;

  @ApiProperty({ required: false, type: [String] })
  @Prop({ type: [String] })
  attachments?: string[];
}
export const DoubtMessageSchema = SchemaFactory.createForClass(DoubtMessage);

@Schema()
export class Doubt {
  @ApiProperty()
  @Prop({ required: true })
  student: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, ref: Course.name })
  course: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, ref: Teacher.name })
  teacher: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  question: string;

  @ApiProperty({ required: false, type: [String] })
  @Prop({ type: [String], required: false })
  attachments?: string[];

  @ApiProperty({ required: false, type: [DoubtMessage] })
  @Prop({ type: [DoubtMessageSchema], default: [] })
  messages?: DoubtMessage[];
}

export const DoubtSchema = SchemaFactory.createForClass(Doubt);
