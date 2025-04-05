import { Module } from '@nestjs/common';
import { Banner4Controller } from './banner4.controller';
import { Banner4LogicService } from './banner4.logic';
import { Banner4DataService } from './banner4.data';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner4, Banner4Schema } from '../../../schemas/home/banner4.schema';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Banner4.name, schema: Banner4Schema }]),
  ],
  providers: [Banner4DataService, Banner4LogicService, ImageUploaderService],
  controllers: [Banner4Controller],
})
export class Banner4Module {}