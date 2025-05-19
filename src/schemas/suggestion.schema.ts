import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { MongooseDocument } from './common.schema';


export type SuggestionDocument = HydratedDocument<Suggestion>;

@Schema({ timestamps: true })
export class Suggestion extends MongooseDocument {
  @ApiProperty({ description: 'Title of the suggestion' })
  @Prop({ required: true })
  title: string;

  @ApiPropertyOptional({ description: 'Description of the suggestion' })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Type of suggestion'
  })
  @Prop({ required: true})
  type: string;

  @ApiProperty({ description: 'Content of the suggestion (URL or PDF S3 URL)' })
  @Prop({ required: true })
  content: string;

  @ApiProperty({ description: 'Reference to the batch' })
  @Prop({ type: Types.ObjectId, ref: 'Batch', required: true })
  batchId: Types.ObjectId;

  @ApiProperty({ description: 'Reference to the teacher' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacherId: Types.ObjectId;

  @ApiProperty({ description: 'Approval status of the suggestion' })
  @Prop({ default: false })
  isApproved: boolean;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);