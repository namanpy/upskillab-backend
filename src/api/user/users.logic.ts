import { Injectable } from '@nestjs/common';
import { UserDataService } from './users.data';

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


}
