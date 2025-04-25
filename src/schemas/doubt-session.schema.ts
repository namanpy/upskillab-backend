import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type DoubtDocument = HydratedDocument<Doubt>;
export type AnswerDocument = HydratedDocument<Answer>;

@Schema()
class Answer {
  @ApiProperty({type: String})
  @Prop({ required: false })
  teacherId?: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: false })
  response?: string;

  @ApiProperty({ required: false, type: [String] })
  @Prop({ type: [String] })
  attachments?: string[];
  
}

@Schema()
export class Doubt {
  @ApiProperty()
  @Prop({ required: true })
  studentId: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  courseId: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  question: string;

  @ApiProperty({ required: false, type: [String] })
  @Prop({ type: [String], required: false })
  attachments?: string[];
}

export const DoubtSchema = SchemaFactory.createForClass(Doubt);
export const AnswerSchema = SchemaFactory.createForClass(Answer);
