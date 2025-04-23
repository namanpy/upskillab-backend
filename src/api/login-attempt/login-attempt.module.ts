import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginAttempt, LoginAttemptSchema } from '../../schemas/login-attempt.schema';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { LoginAttemptDataService } from './login-attempt.data';

@Module({
    imports: [
        ConfigModule.forRoot(), // Add ConfigModule to provide ConfigService
        MongooseModule.forFeature([
            { name: LoginAttempt.name, schema: LoginAttemptSchema },
        ]),
    ],
    providers: [LoginAttemptDataService],
    controllers: [],
    exports: [LoginAttemptDataService],
})
export class LoginAttemptModule {}
