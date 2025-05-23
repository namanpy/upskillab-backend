import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LoginAttempt,
  LoginAttemptDocument,
} from 'src/schemas/login-attempt.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class LoginAttemptDataService {
  constructor(
    @InjectModel(LoginAttempt.name)
    private readonly loginAttemptModel: Model<LoginAttemptDocument>,
  ) {}

  async createLoginAttempt({
    user,
    otpCode,
  }: {
    user: string;
    otpCode: string;
  }) {
    const attempt = new this.loginAttemptModel({
      user,
      otpCode,
    });
    return attempt.save();
  }

  async findAttemptById(attemptId: string) {
    return this.loginAttemptModel
      .findById(attemptId)
      .populate<{ user: User }>('user')
      .exec();
  }

  async deleteAttemptById(attemptId: string) {
    return this.loginAttemptModel.findByIdAndDelete(attemptId).exec();
  }
}
