import { Injectable } from '@nestjs/common';
import { UserDataService } from './users.data';

@Injectable()
export class UsersLogicService {
  constructor(private usersDataService: UserDataService) {}

  async users(username : string | null) {
    return{
      users: await this.usersDataService.users(username),
    };
  }
  async email(userEmail : string | null) {
    return{
      users: await this.usersDataService.users(userEmail),
    };
  }

}
