import { Injectable, NotFoundException } from '@nestjs/common';
import { LanguageDataService } from './language.data';
import {
  CreateLanguageRequestDto,
  GetLanguagesRequestDto,
} from '../../dto/language.dto';

@Injectable()
export class LanguageLogicService {
  constructor(private languageDataService: LanguageDataService) {}

  async createLanguage(createLanguageDto: CreateLanguageRequestDto) {
    await this.languageDataService.createLanguage(createLanguageDto);
    return { isSuccess: true };
  }

  async getLanguages(query: GetLanguagesRequestDto) {
    return await this.languageDataService.getLanguages(query);
  }

  async getLanguageById(id: string) {
    return await this.languageDataService.getLanguageById(id);
  }

  async updateLanguage(
    id: string,
    updateData: Partial<CreateLanguageRequestDto>,
  ) {
    const language = await this.languageDataService.updateLanguage(
      id,
      updateData,
    );
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return { isSuccess: true };
  }

  async deleteLanguage(id: string) {
    const language = await this.languageDataService.deleteLanguage(id);
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return { message: 'Language deleted successfully' };
  }
}
