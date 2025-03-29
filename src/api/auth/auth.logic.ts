import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
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

  async login(input: {
    mobileNumber?: string;
    email?: string;
    password: string;
  }): Promise<any> {
    const { email, mobileNumber, password } = input;

    if (!email && !mobileNumber) throw new CustomError(ERROR.BAD_REQUEST);

    const user = await this.userDataService.getUserByEmailOrPhone({
      email,
      mobileNumber,
    });

    if (await bcrypt.compare(password, user.password)) {
      const authToken = await this.jwtService.signAsync({
        userId: user._id,
        email: user.email,
        mobileNumber: user.mobileNumber,
      });
      return { authToken };
    } else throw new CustomError(ERROR.INVALID_CREDENTIALS);

    return null;
  }
}
