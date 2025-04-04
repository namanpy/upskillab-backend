// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PremiumLearningExperienceDataService } from './premium-learning-experience.data';
// import { CreatePremiumLearningExperienceDto, GetPremiumLearningExperiencesResponseDTO } from '../../../dto/home/premium-learning-experience.dto';


import { Injectable, NotFoundException } from '@nestjs/common';
import { PremiumLearningExperienceDataService } from './premium-learning-experience.data';
import { CreatePremiumLearningExperienceDto } from '../../../dto/home/premium-learning-experience.dto';
import { GetPremiumLearningExperiencesResponseDTO, PremiumLearningExperience } from '../../../dto/home/premium-learning-experience.dto';
import { PremiumLearningExperienceDocument } from '../../../schemas/home/premium-learning-experience.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

@Injectable()
export class PremiumLearningExperienceLogicService {
  constructor(private premiumLearningExperienceDataService: PremiumLearningExperienceDataService) {}

  private mapToDto(ple: PremiumLearningExperienceDocument): PremiumLearningExperience {
    return mapToDto<PremiumLearningExperience, PremiumLearningExperienceDocument>(ple);
  }

  private mapToDtoArray(ples: PremiumLearningExperienceDocument[]): PremiumLearningExperience[] {
    return mapToDtoArray<PremiumLearningExperience, PremiumLearningExperienceDocument>(ples);
  }

  async getPremiumLearningExperiences(): Promise<GetPremiumLearningExperiencesResponseDTO> {
    const premiumLearningExperiences = await this.premiumLearningExperienceDataService.getPremiumLearningExperiences();
    return {
      premiumLearningExperiences: this.mapToDtoArray(premiumLearningExperiences),
    };
  }

  async createPremiumLearningExperience(
    createPremiumLearningExperienceDto: CreatePremiumLearningExperienceDto & { imageUrl: string },
  ) {
    const ple = await this.premiumLearningExperienceDataService.createPremiumLearningExperience(
      createPremiumLearningExperienceDto,
    );
    return {
      premiumLearningExperience: this.mapToDto(ple),
    };
  }

  async getPremiumLearningExperienceById(id: string) {
    const ple = await this.premiumLearningExperienceDataService.getPremiumLearningExperienceById(id);
    if (!ple) {
      throw new NotFoundException(`Premium Learning Experience with ID ${id} not found`);
    }
    return {
      premiumLearningExperience: this.mapToDto(ple),
    };
  }

  async updatePremiumLearningExperience(
    id: string,
    updatePremiumLearningExperienceDto: Partial<CreatePremiumLearningExperienceDto & { imageUrl: string }>,
  ) {
    const ple = await this.premiumLearningExperienceDataService.updatePremiumLearningExperience(
      id,
      updatePremiumLearningExperienceDto,
    );
    if (!ple) {
      throw new NotFoundException(`Premium Learning Experience with ID ${id} not found`);
    }
    return {
      premiumLearningExperience: this.mapToDto(ple),
    };
  }

  async deletePremiumLearningExperience(id: string) {
    const ple = await this.premiumLearningExperienceDataService.deletePremiumLearningExperience(id);
    if (!ple) {
      throw new NotFoundException(`Premium Learning Experience with ID ${id} not found`);
    }
    return { message: 'Premium Learning Experience deleted successfully' };
  }
}