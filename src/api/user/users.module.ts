import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'src/schemas/user.schema';

import { UsersController } from './users.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})

@Module({
  controllers: [UsersController],  // Ensure the controller is registered
})
export class UsersModule {}
