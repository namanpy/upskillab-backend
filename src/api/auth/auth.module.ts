import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/common/constants/auth.constants';
import { AuthController } from './auth.controller';
import { AuthLogicService } from './auth.logic';
import { UsersModule } from '../user/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { SendGridModule } from 'src/common/services/sendgrid.module';
import { LoginAttemptModule } from '../login-attempt/login-attempt.module';
import { UserSessionDataService } from '../user-session/user-session.data';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSession, UserSessionSchema } from '../../schemas/user-session.schema';

@Module({
  imports: [
    UsersModule,
    SendGridModule,
    LoginAttemptModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: UserSession.name, schema: UserSessionSchema },
    ]),
  ],
  providers: [
    AuthLogicService,
    LocalStrategy,
    JwtStrategy,
    UserSessionDataService, // Register here
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
