import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsLogicService } from './stats.logic';
import { StatsDataService } from './stats.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Stats, StatsSchema } from '../../../schemas/home/stats.schema';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

@Module({
  imports: [
    ConfigModule.forRoot(), // Add ConfigModule to provide ConfigService
    MongooseModule.forFeature([{ name: Stats.name, schema: StatsSchema }]),
  ],
  providers: [StatsDataService, StatsLogicService, ImageUploaderService],
  controllers: [StatsController],
  exports: [StatsDataService],
})
export class StatsModule {}