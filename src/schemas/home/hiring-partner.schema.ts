import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type HiringPartnerDocument = HydratedDocument<HiringPartner> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class HiringPartner {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  logo: string; // URL of the partner's logo

  @ApiProperty()
  @Prop({ required: true })
  name: string; // Name of the hiring partner

  @ApiProperty()
  @Prop({ default: true })
  active: boolean; // Active status, defaults to true
}

export const HiringPartnerSchema = SchemaFactory.createForClass(HiringPartner);