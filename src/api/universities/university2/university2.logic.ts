import { Injectable, NotFoundException } from '@nestjs/common';
import { University2DataService } from './university2.data';
import { CreateUniversity2Dto, GetUniversity2sResponseDTO, University2 } from '../../../dto/universities/university2.dto';
import { University2Document } from '../../../schemas/universities/university2.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

@Injectable()
export class University2LogicService {
  constructor(private university2DataService: University2DataService) {}

  private mapToDto(university: University2Document): University2 {
    return mapToDto<University2, University2Document>(university);
  }

  private mapToDtoArray(universities: University2Document[]): University2[] {
    return mapToDtoArray<University2, University2Document>(universities);
  }

  async getUniversities(): Promise<University2[]> {
    const universities = await this.university2DataService.getUniversities();
    return this.mapToDtoArray(universities);
  }

  async createUniversity(createUniversityDto: CreateUniversity2Dto & { imageUrl: string; logoUrl: string }) {
    const university = await this.university2DataService.createUniversity(createUniversityDto);
    return {
      university: this.mapToDto(university),
    };
  }

  async getUniversityById(id: string) {
    const university = await this.university2DataService.getUniversityById(id);
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return {
      university: this.mapToDto(university),
    };
  }

  async updateUniversity(id: string, updateUniversityDto: Partial<CreateUniversity2Dto & { imageUrl?: string; logoUrl?: string }>) {
    const university = await this.university2DataService.updateUniversity(id, updateUniversityDto);
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return {
      university: this.mapToDto(university),
    };
  }

  async deleteUniversity(id: string) {
    const university = await this.university2DataService.deleteUniversity(id);
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return { message: 'University deleted successfully' };
  }
}