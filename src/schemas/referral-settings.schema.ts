import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReferralSettingsDocument = ReferralSettings & Document;

@Schema({ timestamps: true })
export class ReferralSettings {
  @Prop({ required: true })
  discountPercentage: number;

  @Prop({ default: true })
  isActive: boolean;
}



export const ReferralSettingsSchema = SchemaFactory.createForClass(ReferralSettings);
