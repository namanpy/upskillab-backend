import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesLogicService } from './stories.logic';
import { StoriesDataService } from './stories.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from '../../schemas/stories.schema';
import { ImageUploaderService } from '../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
  ],
  providers: [StoriesDataService, StoriesLogicService, ImageUploaderService],
  controllers: [StoriesController],
})
export class StoriesModule {}