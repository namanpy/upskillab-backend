import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'src/schemas/user.schema';
import { UserDataService } from './users.data';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserDataService],
  controllers: [],
  exports: [UserDataService],
})
export class UserModule {}
