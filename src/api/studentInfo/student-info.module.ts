import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { Student, StudentSchema } from '../../schemas/student.schema';
import { Order, OrderSchema } from '../../schemas/order.schema';
import { Batch, BatchSchema } from '../../schemas/course/batch.schema';
import { Course, CourseSchema } from '../../schemas/course/course.schema';
import { StudentInfoController } from './student-info.controller';
import { StudentInfoLogicService } from './student-info.logic';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Batch.name, schema: BatchSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  controllers: [StudentInfoController],
  providers: [StudentInfoLogicService],
})
export class StudentInfoModule {}