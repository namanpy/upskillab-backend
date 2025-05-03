import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserSession,
  UserSessionDocument,
} from '../../schemas/user-session.schema';

@Injectable()
export class UserSessionDataService {
  constructor(
    @InjectModel(UserSession.name) private userSessionModel: Model<UserSession>,
  ) {}

  async createSession(data: {
    user: Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
  }) {
    const session = new this.userSessionModel(data);
    return session.save();
  }

  async getSessionByUser(userId: Types.ObjectId) {
    return this.userSessionModel.findOne({ user: userId }).lean().exec();
  }

  async getSessionByRefreshToken(refreshToken: string) {
    return this.userSessionModel.findOne({ refreshToken }).lean().exec();
  }

  async updateRefreshToken(
    userId: Types.ObjectId,
    newRefreshToken: string,
    newExpiresAt: Date,
  ) {
    return this.userSessionModel
      .findOneAndUpdate(
        { user: userId },
        { refreshToken: newRefreshToken, expiresAt: newExpiresAt },
        { new: true },
      )
      .lean()
      .exec();
  }

  async deleteSessionByUser(userId: Types.ObjectId) {
    return this.userSessionModel.deleteOne({ user: userId }).exec();
  }
}
