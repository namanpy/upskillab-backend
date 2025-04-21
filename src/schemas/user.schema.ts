import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiPropertyOptional({
    type: String,
  })
  @Prop({
    type: String,
    validate: function (this, value: string) {
      this.mobileNumber && this.email ? false : true;
    },
    required: true,
  })
  email: string;

  @ApiPropertyOptional({
    type: String,
  })
  @Prop({
    type: String,
    validate: function (this, value: string) {
      this.mobileNumber && this.email ? false : true;
    },
  })
  mobileNumber?: string;

  @ApiProperty({
    required: true,
  })
  @Prop()
  username: string;

  @Prop({
    required: false,
    select: false,
  })
  password?: string;

  @ApiProperty()
  @Prop({ required: true, enum: ['admin', 'student', 'teacher'] })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
