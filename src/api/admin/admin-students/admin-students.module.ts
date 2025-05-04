import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminStudentsController } from './admin-students.controller';
import { AdminStudentsLogicService } from './admin-students.logic';
import { AdminStudentsDataService } from './admin-students.data';
import { UserSchema } from '../../../schemas/user.schema';
import { StudentSchema } from '../../../schemas/student.schema';
import { OrderSchema } from '../../../schemas/order.schema';
import { BatchSchema } from '../../../schemas/course/batch.schema'; // Import BatchSchema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Student', schema: StudentSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'Batch', schema: BatchSchema }, // Register BatchSchema
    ]),
  ],
  controllers: [AdminStudentsController],
  providers: [AdminStudentsLogicService, AdminStudentsDataService],
})
export class AdminStudentsModule {}