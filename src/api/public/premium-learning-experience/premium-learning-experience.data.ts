// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { PremiumLearningExperience, PremiumLearningExperienceDocument } from '../../../schemas/home/premium-learning-experience.schema';
// import { CreatePremiumLearningExperienceDto } from '../../../dto/home/premium-learning-experience.dto';

// @Injectable()
// export class PremiumLearningExperienceDataService {
//   constructor(
//     @InjectModel(PremiumLearningExperience.name)
//     private premiumLearningExperienceModel: Model<PremiumLearningExperienceDocument>,
//   ) {}

//   async getPremiumLearningExperiences(): Promise<PremiumLearningExperienceDocument[]> {
//     return this.premiumLearningExperienceModel.find().exec();
//   }

//   async createPremiumLearningExperience(
//     createPremiumLearningExperienceDto: CreatePremiumLearningExperienceDto & { imageUrl: string },
//   ): Promise<PremiumLearningExperienceDocument> {
//     const newPremiumLearningExperience = new this.premiumLearningExperienceModel(createPremiumLearningExperienceDto);
//     return newPremiumLearningExperience.save();
//   }

//   async getPremiumLearningExperienceById(id: string): Promise<PremiumLearningExperienceDocument | null> {
//     return this.premiumLearningExperienceModel.findById(id).exec();
//   }

//   async updatePremiumLearningExperience(
//     id: string,
//     updatePremiumLearningExperienceDto: Partial<CreatePremiumLearningExperienceDto & { imageUrl: string }>,
//   ): Promise<PremiumLearningExperienceDocument | null> {
//     return this.premiumLearningExperienceModel
//       .findByIdAndUpdate(id, updatePremiumLearningExperienceDto, { new: true })
//       .exec();
//   }

//   async deletePremiumLearningExperience(id: string): Promise<PremiumLearningExperienceDocument | null> {
//     return this.premiumLearningExperienceModel.findByIdAndDelete(id).exec();
//   }
// }



import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PremiumLearningExperience, PremiumLearningExperienceDocument } from '../../../schemas/home/premium-learning-experience.schema';
import { CreatePremiumLearningExperienceDto } from '../../../dto/home/premium-learning-experience.dto';

@Injectable()
export class PremiumLearningExperienceDataService {
  constructor(@InjectModel(PremiumLearningExperience.name) private premiumLearningExperienceModel: Model<PremiumLearningExperienceDocument>) {}

  async getPremiumLearningExperiences(): Promise<PremiumLearningExperienceDocument[]> {
    return this.premiumLearningExperienceModel.find().exec();
  }

  async createPremiumLearningExperience(createPremiumLearningExperienceDto: CreatePremiumLearningExperienceDto & { imageUrl: string }): Promise<PremiumLearningExperienceDocument> {
    const newPremiumLearningExperience = new this.premiumLearningExperienceModel(createPremiumLearningExperienceDto);
    return newPremiumLearningExperience.save();
  }

  async getPremiumLearningExperienceById(id: string): Promise<PremiumLearningExperienceDocument | null> {
    return this.premiumLearningExperienceModel.findById(id).exec();
  }

  async updatePremiumLearningExperience(id: string, updatePremiumLearningExperienceDto: Partial<CreatePremiumLearningExperienceDto & { imageUrl: string }>): Promise<PremiumLearningExperienceDocument | null> {
    return this.premiumLearningExperienceModel.findByIdAndUpdate(id, updatePremiumLearningExperienceDto, { new: true }).exec();
  }

  async deletePremiumLearningExperience(id: string): Promise<PremiumLearningExperienceDocument | null> {
    return this.premiumLearningExperienceModel.findByIdAndDelete(id).exec();
  }
}