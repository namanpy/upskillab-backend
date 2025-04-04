import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherLogicService } from './teacher.logic';
import { TeacherDataService } from './teacher.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from '../../schemas/teacher.schema';
import { User, UserSchema } from '../../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Teacher.name, schema: TeacherSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [TeacherDataService, TeacherLogicService],
  controllers: [TeacherController],
  exports: [TeacherDataService],
})
export class TeacherModule {}