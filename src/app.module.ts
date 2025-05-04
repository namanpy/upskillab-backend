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
import { PremiumLearningExperienceModule } from './api/public/premium-learning-experience/premium-learning-experience.module';
import { FileModule } from './api/file/file.module';
import { Banner3Module } from './api/public/banner3/banner3.module';
import { Banner4Module } from './api/public/banner4/banner4.module';
import { ContactUsModule } from './api/public/contact-us/contact-us.module';
import { PaymentModule } from './api/payment/payment.module';
import { RegistrationModule } from './api/registration/registration.module';
import { ConfigModule } from '@nestjs/config';
import { HiringPartnerModule } from './api/public/hiring-partner/hiring-partner.module';
import { BlogModule } from './api/blog/blog.module';
import { YoutubeModule } from './api/public/youtube/youtube.module';
import { UniversityModule } from './api/universities/university/university.module';
import { University2Module } from './api/universities/university2/university2.module';
import { UniversityCourseModule } from './api/universities/university-course/university-course.module';
import { UniversityCourse2Module } from './api/universities/university-course-2/university-course-2.module';
import { ClassSessionModule } from './api/scheduler/class-session.module';
import { EnrollmentModule } from './api/enrollment/enrollment.module';
import { RecordedVideoModule } from './api/recorded-video/recorded-video.module';
import { DoubtSessionModule } from './api/doubt-session/doubt-session.module';
import { AdminTeachersModule } from './api/admin/admin-teachers/admin-teachers.module';
import { LiveClassesModule } from './api/live-classes/live-classes.module';
// import { ConfigModule } from '@nestjs/config';
//MongooseModule.forRoot('mongodb://localhost/nest')
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://namanpy:namanpy@namanpy.fr257.mongodb.net/?retryWrites=true&w=majority&appName=namanpy',
    ),
    ConfigModule.forRoot({ isGlobal: true }),
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
    PremiumLearningExperienceModule,
    FileModule,
    Banner3Module,
    Banner4Module,
    ContactUsModule,
    PaymentModule,
    RegistrationModule,
    HiringPartnerModule,
    BlogModule,
    YoutubeModule,
    UniversityModule,
    University2Module,
    UniversityCourseModule,
    UniversityCourse2Module,
    ClassSessionModule,
    EnrollmentModule,
    RecordedVideoModule,
    DoubtSessionModule,
    AdminTeachersModule,
    LiveClassesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
