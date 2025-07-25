import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';

@Injectable()
export class UserDataService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userData: {
    username: string;
    email: string;
    mobileNumber:string;
    userType: string;
    password?: string;
  }) {
    const existingUser = await this.userModel.findOne({
      email: userData.email,
    });

    if (existingUser) {
      throw new CustomError(ERROR.USER_ALREADY_EXISTS);
    }

    const newUser = new this.userModel(userData);
    return newUser.save().then((d) => d.toObject({}));
  }
  async getUserByEmailOrPhone({ identifier }: { identifier: string }) {
    const user = await this.userModel
      .findOne({
        $or: [{ email: identifier }, { mobileNumber: identifier }],
      })
      .select('+password')
      .lean()
      .exec();
    if (!user) throw new CustomError(ERROR.USER_NOT_FOUND);
    return user;
  }

  async getUserByEmail({ email }: { email: string }) {
    const user = await this.userModel.findOne({ email }).lean().exec();
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) throw new CustomError(ERROR.USER_NOT_FOUND);
    return user;
  }
  async findbyUsernameorEmailorMobile(searchString: string) {
    const filters = {
      $or: [
        { username: { $regex: searchString } },
        { email: { $regex: searchString } },
        { mobileNumber: { $regex: searchString } },
      ],
    };
    return this.userModel.find(filters).exec();
  }

  async updateUserDetails(inputs: {
    _id: string;
    username?: string;
    email?: string;
    mobileNumber?: string;
  }) {
    const { _id, username, email, mobileNumber } = inputs;
    const updateData: any = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    return this.userModel
      .findOneAndUpdate({ _id }, updateData, { new: true })
      .exec();
  }
  async findOne(_id: Types.ObjectId) {
    return this.userModel.findOneAndUpdate(_id, { new: true }).exec();
  }
}
