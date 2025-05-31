import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AssociationDocument = Association & Document;

@Schema({ timestamps: true })
export class Association {
  @ApiProperty({ description: 'Unique identifier for the association' })
  @Prop({ type: Types.ObjectId, required: true, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'URL or path to the association logo', required: false })
  @Prop({ required: false })
  logo: string;

  @ApiProperty({ description: 'Title of the association' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Description of the association' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'Whether the association is active' })
  @Prop({ required: true, default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  @Prop()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @Prop()
  updatedAt: Date;
}

export const AssociationSchema = SchemaFactory.createForClass(Association);