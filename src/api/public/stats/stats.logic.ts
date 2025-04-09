// import { Injectable, NotFoundException } from '@nestjs/common';
// import { StatsDataService } from './stats.data';
// import { CreateStatsDto, GetStatsResponseDTO } from '../../../dto/home/stats.dto';
// // import { StatsDocument } from '../../schemas/stats.schema';

// @Injectable()
// export class StatsLogicService {
//   constructor(private statsDataService: StatsDataService) {}

//   async getStats(): Promise<GetStatsResponseDTO> {
//     const stats = await this.statsDataService.getStats();
//     return {
//       stats: stats.map((stat) => ({
//         _id: stat._id.toString(),
//         count: stat.count,
//         label: stat.label,
//         imageUrl: stat.imageUrl,
//         active: stat.active,
//         createdAt: stat.createdAt,
//         updatedAt: stat.updatedAt,
//       })),
//     };
//   }

//   async createStats(createStatsDto: CreateStatsDto & { imageUrl: string }) {
//     const stat = await this.statsDataService.createStats(createStatsDto);
//     return {
//       stat: {
//         _id: stat._id.toString(),
//         count: stat.count,
//         label: stat.label,
//         imageUrl: stat.imageUrl,
//         active: stat.active,
//         createdAt: stat.createdAt,
//         updatedAt: stat.updatedAt,
//       },
//     };
//   }

//   async getStatsById(id: string) {
//     const stat = await this.statsDataService.getStatsById(id);
//     if (!stat) {
//       throw new NotFoundException(`Stat with ID ${id} not found`);
//     }
//     return {
//       stat: {
//         _id: stat._id.toString(),
//         count: stat.count,
//         label: stat.label,
//         imageUrl: stat.imageUrl,
//         active: stat.active,
//         createdAt: stat.createdAt,
//         updatedAt: stat.updatedAt,
//       },
//     };
//   }

//   async updateStats(id: string, updateStatsDto: Partial<CreateStatsDto & { imageUrl: string }>) {
//     const stat = await this.statsDataService.updateStats(id, updateStatsDto);
//     if (!stat) {
//       throw new NotFoundException(`Stat with ID ${id} not found`);
//     }
//     return {
//       stat: {
//         _id: stat._id.toString(),
//         count: stat.count,
//         label: stat.label,
//         imageUrl: stat.imageUrl,
//         active: stat.active,
//         createdAt: stat.createdAt,
//         updatedAt: stat.updatedAt,
//       },
//     };
//   }

//   async deleteStats(id: string) {
//     const stat = await this.statsDataService.deleteStats(id);
//     if (!stat) {
//       throw new NotFoundException(`Stat with ID ${id} not found`);
//     }
//     return { message: 'Stat deleted successfully' };
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { StatsDataService } from './stats.data';
import { CreateStatsDto, GetStatsResponseDTO, Stats } from '../../../dto/home/stats.dto';
import { StatsDocument } from '../../../schemas/home/stats.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

@Injectable()
export class StatsLogicService {
  constructor(private statsDataService: StatsDataService) {}

  private mapToDto(stats: StatsDocument): Stats {
    return mapToDto<Stats, StatsDocument>(stats);
  }

  private mapToDtoArray(statsArray: StatsDocument[]): Stats[] {
    return mapToDtoArray<Stats, StatsDocument>(statsArray);
  }

  async getStats(): Promise<GetStatsResponseDTO> {
    const stats = await this.statsDataService.getStats();
    return {
      stats: this.mapToDtoArray(stats),
    };
  }

  async createStats(createStatsDto: CreateStatsDto & { imageUrl: string }) {
    const stats = await this.statsDataService.createStats(createStatsDto);
    return {
      stats: this.mapToDto(stats),
    };
  }

  async getStatsById(id: string) {
    const stats = await this.statsDataService.getStatsById(id);
    if (!stats) {
      throw new NotFoundException(`Stats with ID ${id} not found`);
    }
    return {
      stats: this.mapToDto(stats),
    };
  }

  async updateStats(id: string, updateStatsDto: Partial<CreateStatsDto & { imageUrl: string }>) {
    const stats = await this.statsDataService.updateStats(id, updateStatsDto);
    if (!stats) {
      throw new NotFoundException(`Stats with ID ${id} not found`);
    }
    return {
      stats: this.mapToDto(stats),
    };
  }

  async deleteStats(id: string) {
    const stats = await this.statsDataService.deleteStats(id);
    if (!stats) {
      throw new NotFoundException(`Stats with ID ${id} not found`);
    }
    return { message: 'Stats deleted successfully' };
  }
}