import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchLogicService } from './batch.logic';
import { BatchDataService } from './batch.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Batch, BatchSchema } from '../../schemas/course/batch.schema';
import { Course, CourseSchema } from '../../schemas/course/course.schema';
import { Teacher, TeacherSchema } from '../../schemas/teacher.schema';
import { ImageUploaderService } from '../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

@Module({
  imports: [
    ConfigModule.forRoot(), // Add ConfigModule to provide ConfigService
    MongooseModule.forFeature([
      { name: Batch.name, schema: BatchSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Teacher.name, schema: TeacherSchema },
    ]),
  ],
  providers: [BatchDataService, BatchLogicService, ImageUploaderService],
  controllers: [BatchController],
  exports: [BatchDataService],
})
export class BatchModule {}
