import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Suggestion, SuggestionSchema } from '../../schemas/suggestion.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { Teacher, TeacherSchema } from '../../schemas/teacher.schema';
import { SuggestionController } from './suggestion.controller';
import { SuggestionLogicService } from './suggestion.logic';
import { SuggestionDataService } from './suggestion.data';
import { FileUploaderService } from '../../common/services/file-uploader.service';
import { ConfigModule } from '@nestjs/config';
import { BatchModule } from '../batch/batch.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Suggestion.name, schema: SuggestionSchema },
      { name: User.name, schema: UserSchema },
      { name: Teacher.name, schema: TeacherSchema },
    ]),
    ConfigModule,
    BatchModule,
    OrderModule,
  ],
  controllers: [SuggestionController],
  providers: [
    SuggestionLogicService,
    SuggestionDataService,
    FileUploaderService,
  ],
  exports: [SuggestionDataService],
})
export class SuggestionModule {}