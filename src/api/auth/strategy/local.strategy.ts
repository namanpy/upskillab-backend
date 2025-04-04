import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLogicService } from '../auth.logic';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthLogicService) {
    super({ usernameField: 'identifier' });
  }

  async validate(identifier: string, password: string) {
    const user = await this.authService.login({
      identifier,
      password,
    });
    return user;
  }
}
