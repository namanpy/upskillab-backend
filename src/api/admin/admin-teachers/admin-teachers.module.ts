import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminTeachersController } from './admin-teachers.controller';
import { AdminTeachersLogicService } from './admin-teachers.logic';
import { AdminTeachersDataService } from './admin-teachers.data';
import { TeacherSchema } from '../../../schemas/teacher.schema';
import { UserSchema } from '../../../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Teacher', schema: TeacherSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [AdminTeachersController],
  providers: [AdminTeachersLogicService, AdminTeachersDataService],
})
export class AdminTeachersModule {}