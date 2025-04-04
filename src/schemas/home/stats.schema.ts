import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type StatsDocument = HydratedDocument<Stats> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Stats {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  count: string;

  @ApiProperty()
  @Prop({ required: true })
  label: string;

  @ApiProperty()
  @Prop({ required: true })
  imageUrl: string;

  @ApiProperty()
  @Prop({ default: true })
  active: boolean;
}

export const StatsSchema = SchemaFactory.createForClass(Stats);