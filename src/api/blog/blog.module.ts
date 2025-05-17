import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogLogicService } from './blog.logic';
import { BlogDataService } from './blog.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../../schemas/blog.schema';
import { ImageUploaderService } from '../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config';

// Assuming Student schema is defined elsewhere
import { StudentSchema } from '../../schemas/student.schema'; // Adjust path as needed
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: 'Student', schema: StudentSchema }, // Ensure Student schema is registered
    ]),
    StudentModule,
  ],
  providers: [BlogDataService, BlogLogicService, ImageUploaderService],
  controllers: [BlogController],
})
export class BlogModule {}
