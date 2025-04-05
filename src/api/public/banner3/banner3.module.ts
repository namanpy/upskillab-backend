import { Module } from '@nestjs/common';
import { Banner3Controller } from './banner3.controller';
import { Banner3LogicService } from './banner3.logic';
import { Banner3DataService } from './banner3.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner3, Banner3Schema } from '../../../schemas/home/banner3.schema';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Banner3.name, schema: Banner3Schema }]),
  ],
  providers: [Banner3DataService, Banner3LogicService, ImageUploaderService],
  controllers: [Banner3Controller],
})
export class Banner3Module {}