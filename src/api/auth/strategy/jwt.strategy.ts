import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'src/common/constants/auth.constants';
import { UserDataService } from 'src/api/user/users.data';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userDataService: UserDataService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { userId } = payload;

    if (!userId) throw new CustomError(ERROR.USER_NOT_FOUND);

    const user = await this.userDataService.getUserById(userId);

    return user;
  }
}
