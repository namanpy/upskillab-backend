import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UserDataService } from '../user/users.data';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';

@Injectable()
export class AuthLogicService {
  constructor(
    private userDataService: UserDataService,
    private jwtService: JwtService,
  ) {}

  async login(input: { identifier: string; password: string }) {
    const { identifier, password } = input;

    const user = await this.userDataService.getUserByEmailOrPhone({
      identifier,
    });

    if (user.password && (await bcrypt.compare(password, user.password))) {
      const authToken = await this.jwtService.signAsync({
        userId: user._id,
        email: user.email,
        mobileNumber: user.mobileNumber,
      });
      return { authToken };
    } else throw new CustomError(ERROR.INVALID_CREDENTIALS);
  }
}
