import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveClassesController } from './live-classes.controller';
import { LiveClassesLogicService } from './live-classes.logic';
import { LiveClassesDataService } from './live-classes.data';
import { ClassSession, ClassSessionSchema } from '../../schemas/class-session.schema';
import { Attendance, AttendanceSchema } from '../../schemas/attendance.schema';
import { User, UserSchema } from '../../schemas/user.schema'; // Add User schema
import { UsersModule } from '../user/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassSession.name, schema: ClassSessionSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: User.name, schema: UserSchema }, // Add User schema
    ]),
    UsersModule,
  ],
  controllers: [LiveClassesController],
  providers: [LiveClassesLogicService, LiveClassesDataService],
})
export class LiveClassesModule {}