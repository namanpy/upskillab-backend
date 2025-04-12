// import { Injectable, NotFoundException } from '@nestjs/common';
// import { UniversityDataService } from './university.data';
// import { CreateUniversityDto, GetUniversitiesResponseDTO, University, UpdateUniversityDto } from '../../dto/university.dto';
// import { UniversityDocument } from '../../schemas/university.schema';

// @Injectable()
// export class UniversityLogicService {
//   constructor(private universityDataService: UniversityDataService) {}

//   private mapToUniversityDto(university: UniversityDocument): University {
//     const dto: any = {
//       _id: university._id.toString(),
//     };

//     const documentKeys = Object.keys(university.toObject() as UniversityDocument);
//     const dtoKeys = Object.keys({} as University);

//     documentKeys.forEach(key => {
//       if (dtoKeys.includes(key)) {
//         if (key === 'createdAt' || key === 'updatedAt') {
//           dto[key] = university[key] || new Date();
//         } else if (key === '_id') {
//         } else {
//           dto[key] = university[key];
//         }
//       }
//     });

//     dtoKeys.forEach(key => {
//       if (!(key in dto) && key !== '_id') {
//         dto[key] = university[key] || null;
//       }
//     });

//     return dto as University;
//   }

//   private mapToUniversityDtoArray(universities: UniversityDocument[]): University[] {
//     return universities.map(university => this.mapToUniversityDto(university));
//   }

//   async getUniversities(): Promise<GetUniversitiesResponseDTO> {
//     const universities = await this.universityDataService.getUniversities();
//     return {
//       universities: this.mapToUniversityDtoArray(universities),
//     };
//   }

//   async createUniversity(createUniversityDto: CreateUniversityDto) {
//     const university = await this.universityDataService.createUniversity(createUniversityDto);
//     return {
//       university: this.mapToUniversityDto(university),
//     };
//   }

//   async getUniversityById(id: string) {
//     const university = await this.universityDataService.getUniversityById(id);
//     if (!university) {
//       throw new NotFoundException(`University with ID ${id} not found`);
//     }
//     return {
//       university: this.mapToUniversityDto(university),
//     };
//   }

//   async updateUniversity(id: string, updateUniversityDto: UpdateUniversityDto) {
//     const university = await this.universityDataService.updateUniversity(id, updateUniversityDto);
//     if (!university) {
//       throw new NotFoundException(`University with ID ${id} not found`);
//     }
//     return {
//       university: this.mapToUniversityDto(university),
//     };
//   }

//   async patchUniversity(id: string, updateUniversityDto: UpdateUniversityDto) {
//     const university = await this.universityDataService.patchUniversity(id, updateUniversityDto);
//     if (!university) {
//       throw new NotFoundException(`University with ID ${id} not found`);
//     }
//     return {
//       university: this.mapToUniversityDto(university),
//     };
//   }

//   async deleteUniversity(id: string) {
//     const university = await this.universityDataService.deleteUniversity(id);
//     if (!university) {
//       throw new NotFoundException(`University with ID ${id} not found`);
//     }
//     return { message: 'University deleted successfully' };
//   }
// }

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { UniversityDataService } from './university.data';
// import { CreateUniversityDto, GetUniversitiesResponseDTO, University, UpdateUniversityDto } from '../../dto/university.dto';
// import { UniversityDocument } from '../../schemas/university.schema';
// import { mapToDto, mapToDtoArray, BaseDocument } from '../../common/utils/universitys';

// // Local type to satisfy BaseDocument constraint
// type UniversityDocumentWithRequiredTimestamps = UniversityDocument & Required<Pick<BaseDocument, 'createdAt' | 'updatedAt'>>;

// @Injectable()
// export class UniversityLogicService {
//   constructor(private universityDataService: UniversityDataService) {}

//   private mapToDto(university: UniversityDocument): University {
//     // Cast to satisfy BaseDocument constraint, assuming timestamps are present post-hydration
//     const universityWithTimestamps = university as UniversityDocumentWithRequiredTimestamps;
//     return mapToDto<University, UniversityDocumentWithRequiredTimestamps>(universityWithTimestamps);
//   }

//   private mapToDtoArray(universities: UniversityDocument[]): University[] {
//     // Cast to satisfy BaseDocument constraint, assuming timestamps are present post-hydration
//     const universitiesWithTimestamps = universities as UniversityDocumentWithRequiredTimestamps[];
//     return mapToDtoArray<University, UniversityDocumentWithRequiredTimestamps>(universitiesWithTimestamps);
//   }

//   async getUniversities(): Promise<GetUniversitiesResponseDTO> {
//     const universities = await this.universityDataService.getUniversities();
//     return {
//       universities: this.mapToDtoArray(universities),
//     };
//   }

//   async createUniversity(createUniversityDto: CreateUniversityDto & { imageUrl: string }) {
//     const university = await this.universityDataService.createUniversity(createUniversityDto);
//     return {
//       university: this.mapToDto(university),
//     };
//   }

//   async getUniversityById(id: string) {
//     const university = await this.universityDataService.getUniversityById(id);
//     if (!university) {
//       throw new NotFoundException(`University with ID ${id} not found`);
//     }
//     return {
//       university: this.mapToDto(university),
//     };
//   }

//   async updateUniversity(id: string, updateUniversityDto: Partial<CreateUniversityDto & { imageUrl: string }>) {
//     const university = await this.universityDataService.updateUniversity(id, updateUniversityDto);
//     if (!university) {
//       throw new NotFoundException(`University with ID ${id} not found`);
//     }
//     return {
//       university: this.mapToDto(university),
//     };
//   }

//   async patchUniversity(id: string, updateUniversityDto: Partial<CreateUniversityDto & { imageUrl: string }>) {
//     const university = await this.universityDataService.updateUniversity(id, updateUniversityDto);
//     if (!university) {
//       throw new NotFoundException(`University with ID ${id} not found`);
//     }
//     return {
//       university: this.mapToDto(university),
//     };
//   }

//   async deleteUniversity(id: string) {
//     const university = await this.universityDataService.deleteUniversity(id);
//     if (!university) {
//       throw new NotFoundException(`University with ID ${id} not found`);
//     }
//     return { message: 'University deleted successfully' };
//   }
// }



import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityDataService } from './university.data';
import { CreateUniversityDto, GetUniversitiesResponseDTO, University, UpdateUniversityDto } from '../../dto/university.dto';
import { UniversityDocument } from '../../schemas/university.schema';
import { mapToDto, mapToDtoArray, BaseDocument } from '../../common/utils/universitys';

// Local type to satisfy BaseDocument constraint
type UniversityDocumentWithRequiredTimestamps = UniversityDocument & Required<Pick<BaseDocument, 'createdAt' | 'updatedAt'>>;

@Injectable()
export class UniversityLogicService {
  constructor(private universityDataService: UniversityDataService) {}

  private mapToDto(university: UniversityDocument): University {
    // Cast to satisfy BaseDocument constraint, assuming timestamps are present post-hydration
    const universityWithTimestamps = university as UniversityDocumentWithRequiredTimestamps;
    return mapToDto<University, UniversityDocumentWithRequiredTimestamps>(universityWithTimestamps);
  }

  private mapToDtoArray(universities: UniversityDocument[]): University[] {
    // Cast to satisfy BaseDocument constraint, assuming timestamps are present post-hydration
    const universitiesWithTimestamps = universities as UniversityDocumentWithRequiredTimestamps[];
    return mapToDtoArray<University, UniversityDocumentWithRequiredTimestamps>(universitiesWithTimestamps);
  }

  async getUniversities(): Promise<GetUniversitiesResponseDTO> {
    const universities = await this.universityDataService.getUniversities();
    return {
      universities: this.mapToDtoArray(universities),
    };
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

  async patchUniversity(id: string, updateUniversityDto: Partial<CreateUniversityDto & { imageUrl: string }>) {
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