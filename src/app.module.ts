import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestimonialModule } from './api/testimonials/testimonial.module';
import { UsersModule } from './api/user/users.module';

//MongooseModule.forRoot('mongodb://localhost/nest')
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://namanpy:namanpy@namanpy.fr257.mongodb.net/?retryWrites=true&w=majority&appName=namanpy',
    ),
    TestimonialModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
