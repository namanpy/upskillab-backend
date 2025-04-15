import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityDataService } from './university.data';
import { CreateUniversityDto, GetUniversitiesResponseDTO, University } from '../../dto/university.dto';
import { UniversityDocument } from '../../schemas/university.schema';
import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';

@Injectable()
export class UniversityLogicService {
  constructor(private universityDataService: UniversityDataService) {}

  private mapToDto(university: UniversityDocument): University {
    return mapToDto<University, UniversityDocument>(university);
  }

  private mapToDtoArray(universities: UniversityDocument[]): University[] {
    return mapToDtoArray<University, UniversityDocument>(universities);
  }

  async getUniversities(): Promise<CreateUniversityDto[]> {
    const universities = await this.universityDataService.getUniversities();
    return this.mapToDtoArray(universities);
  }

  async createUniversity(createUniversityDto: CreateUniversityDto & { imageUrl: string }) {
    const university = await this.universityDataService.createUniversity(createUniversityDto);
    return {
      university: this.mapToDto(university),
    };
  }

  async getUniversityById(id: string) {
    const university = await this.universityDataService.getUniversityById(id);
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return {
      university: this.mapToDto(university),
    };
  }

  async updateUniversity(id: string, updateUniversityDto: Partial<CreateUniversityDto & { imageUrl: string }>) {
    const university = await this.universityDataService.updateUniversity(id, updateUniversityDto);
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return {
      university: this.mapToDto(university),
    };
  }

  async deleteUniversity(id: string) {
    const university = await this.universityDataService.deleteUniversity(id);
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return { message: 'University deleted successfully' };
  }
}