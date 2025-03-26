import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesLogicService } from './stories.logic';
import { StoriesDataService } from './stories.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from '../../schemas/stories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
  ],
  providers: [StoriesDataService, StoriesLogicService],
  controllers: [StoriesController],
  exports: [StoriesDataService], // Optional, agar baahar use karna ho
})
export class StoriesModule {}