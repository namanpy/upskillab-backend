import { Injectable } from '@nestjs/common';
import { UserDataService } from './users.data';

@Injectable()
export class UsersLogicService {
  constructor(private usersDataService: UserDataService) {}

  async users() {
    return{
      users: await this.usersDataService.users(),
    };
  }
}
