import { Injectable } from '@nestjs/common';
import { UserDataService } from './users.data';
import { ObjectId } from 'mongoose';

@Injectable()
export class UsersLogicService {
  constructor(private usersDataService: UserDataService) {}

  async findbyUsernameorEmailorMobile(inputs: { searchString: string }) {
    const { searchString } = inputs;
    return {
      users: await this.usersDataService.findbyUsernameorEmailorMobile(searchString),
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
