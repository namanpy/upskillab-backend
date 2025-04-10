import { Module } from '@nestjs/common';
import { StoryController } from './stories.controller'; // Fixed from StoriesController
import { StoryLogicService } from './stories.logic'; // Fixed from StoriesLogicService
import { StoryDataService } from './stories.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from '../../schemas/stories.schema';
import { ImageUploaderService } from '../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
  ],
  providers: [StoryDataService, StoryLogicService, ImageUploaderService],
  controllers: [StoryController],
})
export class StoriesModule {}