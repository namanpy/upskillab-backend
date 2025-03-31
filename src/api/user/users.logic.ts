import { Injectable } from '@nestjs/common';
import { UserDataService } from './users.data';
import { ObjectId } from 'mongoose';

@Injectable()
export class UsersLogicService {
  constructor(private usersDataService: UserDataService) {}

  async findbyUsernameorEmailorMobile(inputs: { username?: string; email?: string; mobileNumber?: string }) {
    const { username, email, mobileNumber} = inputs;
    return {
      users: await this.usersDataService.findbyUsernameorEmailorMobile({
        username,
        email,
        mobileNumber,
      }),
    };
  }

  async updateUserDetails(inputs: { _id: string; username?: string; email?: string; mobileNumber?: string }) {
    const { _id, username, email, mobileNumber } = inputs;
    
    return {
      user: await this.usersDataService.updateUserDetails({
        _id,
        username,
        email,
        mobileNumber,
      }),
    };

  }
}
