// TODO
// Reference - https://docs.nestjs.com/security/authentication

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomError } from '../classes/error.class';
import { ERROR } from '../constants/error.constants';

export const USERTYPE_KEY = 'userType';
export const AllowUserType = (userType: string) =>
  SetMetadata(USERTYPE_KEY, [userType]);

export const AllowUserTypes = (userTypes: string[]) =>
  SetMetadata(USERTYPE_KEY, userTypes);

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredUserTypes = this.reflector.get<string>(
      USERTYPE_KEY,
      context.getHandler(),
    );

    // If no userType is required, allow access
    if (!requiredUserTypes || requiredUserTypes.length === 0) {
      return true;
    }

    // Check if user exists and has the correct userType
    if (!request.user) {
      throw new CustomError(ERROR.USER_NOT_FOUND);
    }

    if (requiredUserTypes.includes(request.user.userType)) {
      throw new CustomError(ERROR.ACCESS_DENIED);
    }

    return true;
  }
}
