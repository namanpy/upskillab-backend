import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @ApiProperty({ description: 'Unique identifier for the job' })
  @Prop({ type: Types.ObjectId, required: true, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Title of the job' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Subtitle or short description of the job' })
  @Prop({ required: true })
  subtitle: string;

  @ApiProperty({ description: 'Detailed description of the job' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'Name of the company offering the job' })
  @Prop({ required: true })
  company: string;

  @ApiProperty({ description: 'URL of the company logo', required: false })
  @Prop({ required: false })
  logo: string;

  @ApiProperty({ description: 'List of required skills for the job', type: [String] })
  @Prop({ type: [String], required: true })
  skills: string[];

  @ApiProperty({ description: 'Additional links related to the job', type: [String], required: false })
  @Prop({ required: false })
  ExtraLink: string;

  @ApiProperty({
    description: 'Source of the job (upskill or external)',
    enum: ['upskill', 'external'],
    required: false,
  })
  @Prop({ type: String, enum: ['upskill', 'external'], required: false })
  source: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @Prop()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @Prop()
  updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);