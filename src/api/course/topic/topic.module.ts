import { Module } from '@nestjs/common';
import { TopicDataService } from './topic.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic, TopicSchema } from '../../../schemas/course/topic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]),
  ],
  providers: [TopicDataService],
  controllers: [],
  exports: [TopicDataService],
})
export class TopicModule {}
