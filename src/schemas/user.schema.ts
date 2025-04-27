import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { USER_TYPES } from 'src/common/constants/user.constants';

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
      this.mobileNumber || this.email ? true : false;
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
  @Prop({ required: true, enum: Object.values(USER_TYPES) })
  userType: string;

  // ✅ isActive field added here
  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @Prop({
    type: Boolean,
    default: false,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
