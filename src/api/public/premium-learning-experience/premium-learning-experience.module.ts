import { Module } from '@nestjs/common';
import { PremiumLearningExperienceController } from './premium-learning-experience.controller';
import { PremiumLearningExperienceLogicService } from './premium-learning-experience.logic';
import { PremiumLearningExperienceDataService } from './premium-learning-experience.data';
import { MongooseModule } from '@nestjs/mongoose';
import { PremiumLearningExperience, PremiumLearningExperienceSchema } from '../../../schemas/home/premium-learning-experience.schema';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: PremiumLearningExperience.name, schema: PremiumLearningExperienceSchema },
    ]),
  ],
  providers: [PremiumLearningExperienceDataService, PremiumLearningExperienceLogicService, ImageUploaderService],
  controllers: [PremiumLearningExperienceController],
  exports: [PremiumLearningExperienceDataService],
})
export class PremiumLearningExperienceModule {}