import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

}
