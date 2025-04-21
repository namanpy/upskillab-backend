import { Module } from '@nestjs/common';
import { UniversityController } from './university.controller';
import { UniversityLogicService } from './university.logic';
import { UniversityDataService } from './university.data';
import { MongooseModule } from '@nestjs/mongoose';
import { University, UniversitySchema } from '../../../schemas/universities/university.schema';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: University.name, schema: UniversitySchema }]),
  ],
  providers: [UniversityDataService, UniversityLogicService, ImageUploaderService],
  controllers: [UniversityController],
  exports: [UniversityDataService],
})
export class UniversityModule {}