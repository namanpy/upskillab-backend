import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Blog {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  image: string; // URL of the blog image

  @ApiProperty()
  @Prop({ required: true })
  tag: string; // Dynamic tag, user-created

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true }) // Reference to students table
  studentId: Types.ObjectId;

  @ApiProperty()
  @Prop({ default: false })
  approvedByAdmin: boolean; // Default to false, admin approval required

  @ApiProperty()
  @Prop()
  approvedAt: Date; // Date when admin approved, optional
}

export const BlogSchema = SchemaFactory.createForClass(Blog);