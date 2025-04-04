import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerLogicService } from './banner.logic';
import { BannerDataService } from './banner.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from '../../../schemas/home/banner.schema';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config'; // Add this

@Module({
  imports: [
    ConfigModule.forRoot(), // Add this
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
  ],
  providers: [BannerDataService, BannerLogicService, ImageUploaderService],
  controllers: [BannerController],
  exports: [BannerDataService],
})
export class BannerModule {}