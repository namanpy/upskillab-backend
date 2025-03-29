import { Injectable } from '@nestjs/common';
import { UserDataService } from './users.data';

@Injectable()
export class UserLogicService {
  constructor(private userDataService: UserDataService) {}
}
