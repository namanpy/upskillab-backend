import { Module } from '@nestjs/common';
import { UniversityController } from './university.controller';
import { UniversityLogicService } from './university.logic';
import { UniversityDataService } from './university.data';
import { MongooseModule } from '@nestjs/mongoose';
import { University, UniversitySchema } from '../../schemas/university.schema';
import { ImageUploaderService } from '../../common/services/image-uploader.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: University.name, schema: UniversitySchema }]),
  ],
  controllers: [UniversityController],
  providers: [UniversityLogicService, UniversityDataService, ImageUploaderService],
})
export class UniversityModule {}