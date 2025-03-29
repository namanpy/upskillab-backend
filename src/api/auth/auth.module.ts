import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { User, UserSchema } from 'src/schemas/user.schema';
import { JWT_SECRET } from 'src/common/constants/auth.constants';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class UserModule {}
