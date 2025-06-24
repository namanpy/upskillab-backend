import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Referral {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Course', default: [] })
  courseIds: Types.ObjectId[];

  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, ref: 'User' },
        courseId: { type: Types.ObjectId, ref: 'Course' },
        status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
      },
    ],
    default: [],
  })
  referredUsers: {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    status: string;
  }[];
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);
export type ReferralDocument = Referral & Document;