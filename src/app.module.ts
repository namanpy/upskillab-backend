import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestimonialModule } from './api/testimonials/testimonial.module';
import { StoriesModule } from './api/stories/stories.module';
import { DemoSessionModule } from './api/demosessions/demosession.module';
import { CategoryModule } from './api/category/category.module';
import { BatchModule } from './api/batch/batch.module';
import { CourseModule } from './api/course/course.module';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/user/users.module';
import { ChapterModule } from './api/course/chapter/chapter.module';
import { TopicModule } from './api/course/topic/topic.module';
import { FAQModule } from './api/faq/faq.module';
import { BannerModule } from './api/public/banner/banner.module';
import { StatsModule } from './api/public/stats/stats.module';
import { TeacherModule } from './api/teachers/teacher.module';
//MongooseModule.forRoot('mongodb://localhost/nest')
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://namanpy:namanpy@namanpy.fr257.mongodb.net/?retryWrites=true&w=majority&appName=namanpy',
    ),
    StoriesModule,
    TestimonialModule,
    DemoSessionModule,
    CategoryModule,
    BatchModule,
    CourseModule,
    ChapterModule,
    TopicModule,
    AuthModule,
    UsersModule,
    FAQModule,
    BannerModule,
    StatsModule,
    TeacherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
