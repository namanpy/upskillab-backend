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

  @ApiPropertyOptional({})
  @Prop({
    type: String,
    validate: function (this, value: string) {
      this.mobileNumber && this.email ? false : true;
    },
    default: true,
  })
  email: string | null;

  @ApiPropertyOptional({})
  @Prop({
    type: String,
    validate: function (this, value: string) {
      this.mobileNumber && this.email ? false : true;
    },
    default: true,
  })
  mobileNumber: string | null;

  @ApiProperty({
    required: true,
  })
  @Prop()
  username: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
