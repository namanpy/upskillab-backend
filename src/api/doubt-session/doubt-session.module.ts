import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Doubt, DoubtSchema } from 'src/schemas/doubt-session.schema';
import { DoubtSessionController } from './doubt-session.controller';
import { DoubtSessionLogicService } from './doubt-session.logic';
import { DoubtSessionDataService } from './doubt-session.data';
import { StudentDataService } from '../student/student.data';
import { TeacherDataService } from '../teachers/teacher.data';
import { EnrollmentDataService } from '../enrollment/enrollment.data';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { StudentModule } from '../student/student.module';
import { TeacherModule } from '../teachers/teacher.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doubt.name, schema: DoubtSchema }]),
    EnrollmentModule,
    StudentModule,
    TeacherModule,
  ],
  controllers: [DoubtSessionController],
  providers: [
    DoubtSessionLogicService,
    DoubtSessionDataService,
    StudentDataService,
    TeacherDataService,
    EnrollmentDataService,
  ],
  exports: [DoubtSessionLogicService, DoubtSessionDataService],
})
export class DoubtSessionModule {}
