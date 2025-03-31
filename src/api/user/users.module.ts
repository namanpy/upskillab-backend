import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersController } from './users.controller';
import { UserDataService } from './users.data';
import { UsersLogicService } from './users.logic';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserDataService, UsersLogicService],
  controllers: [UsersController],
  exports: [UserDataService],
})
export class UsersModule {}
