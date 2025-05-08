// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Student, StudentSchema } from '../../schemas/student.schema';
// import { StudentDataService } from './student.data';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
//   ],
//   providers: [StudentDataService],
//   exports: [StudentDataService],
// })
// export class StudentModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from '../../schemas/student.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { StudentController } from './student.controller';
import { StudentLogicService } from './student.logic';
import { StudentDataService } from './student.data';
import { ImageUploaderService } from '../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ConfigModule,
    OrderModule,
  ],
  controllers: [StudentController],
  providers: [
    StudentLogicService,
    StudentDataService,
    ImageUploaderService,
  ],
  exports: [StudentDataService],
})
export class StudentModule {}