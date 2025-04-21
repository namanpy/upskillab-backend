import { Module } from '@nestjs/common';
import { University2Controller } from './university2.controller';
import { University2LogicService } from './university2.logic';
import { University2DataService } from './university2.data';
import { MongooseModule } from '@nestjs/mongoose';
import { University2, University2Schema } from '../../../schemas/universities/university2.schema';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: University2.name, schema: University2Schema },
    ]),
  ],
  controllers: [University2Controller],
  providers: [University2LogicService, University2DataService, ImageUploaderService],
  exports: [University2LogicService], // Add this to export the service
})
export class University2Module {}