import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { Student, StudentSchema } from '../../schemas/student.schema';
import { Order, OrderSchema } from '../../schemas/order.schema';
import { Batch, BatchSchema } from '../../schemas/course/batch.schema';
import { Course, CourseSchema } from '../../schemas/course/course.schema';
import { Attendance, AttendanceSchema } from '../../schemas/attendance.schema';
import { ClassSession, ClassSessionSchema } from '../../schemas/class-session.schema';
import { StudentInfoController } from './student-info.controller';
import { StudentInfoLogicService } from './student-info.logic';
import { LiveClassesDataService } from '../live-classes/live-classes.data';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Batch.name, schema: BatchSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: ClassSession.name, schema: ClassSessionSchema },
    ]),
  ],
  controllers: [StudentInfoController],
  providers: [StudentInfoLogicService, LiveClassesDataService],
})
export class StudentInfoModule {}