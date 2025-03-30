import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserDataService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findbyUsernameorEmailorMobile(inputs: { username?: string; email?: string; mobileNumber?: string }) {
    const { username, email, mobileNumber } = inputs;

    const filters = username? { username: { $regex: username } }: 
                    email? { email: { $regex: email } }:
                    mobileNumber? { mobileNumber: { $regex: mobileNumber } }: 
                    {};
    return this.userModel.find(filters).exec();
  }

  async updateUserDetails(inputs: { _id: ObjectId; username?: string; email?: string; mobileNumber?: string }) {
    const { _id, username, email, mobileNumber } = inputs;
    const updateData: any = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;

    return this.userModel.findOneAndUpdate(_id, updateData, { new: true }).exec();
  }
  async findOne(_id: ObjectId) {
      return this.userModel.findOneAndUpdate(_id, { new: true }).exec();
  }
}

