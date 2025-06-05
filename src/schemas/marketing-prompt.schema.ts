import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class MarketingPrompt {
  _id: Types.ObjectId;
  @ApiProperty({ description: 'Name for the marketing prompt' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Image URL for the marketing prompt' })
  @Prop({ required: true })
  image: string;

  @ApiProperty({ description: 'Whether the prompt is active' })
  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const MarketingPromptSchema = SchemaFactory.createForClass(MarketingPrompt);