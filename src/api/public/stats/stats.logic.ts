import { Injectable, NotFoundException } from '@nestjs/common';
import { StatsDataService } from './stats.data';
import { CreateStatsDto, GetStatsResponseDTO } from '../../../dto/home/stats.dto';
// import { StatsDocument } from '../../schemas/stats.schema';

@Injectable()
export class StatsLogicService {
  constructor(private statsDataService: StatsDataService) {}

  async getStats(): Promise<GetStatsResponseDTO> {
    const stats = await this.statsDataService.getStats();
    return {
      stats: stats.map((stat) => ({
        _id: stat._id.toString(),
        count: stat.count,
        label: stat.label,
        imageUrl: stat.imageUrl,
        active: stat.active,
        createdAt: stat.createdAt,
        updatedAt: stat.updatedAt,
      })),
    };
  }

  async createStats(createStatsDto: CreateStatsDto & { imageUrl: string }) {
    const stat = await this.statsDataService.createStats(createStatsDto);
    return {
      stat: {
        _id: stat._id.toString(),
        count: stat.count,
        label: stat.label,
        imageUrl: stat.imageUrl,
        active: stat.active,
        createdAt: stat.createdAt,
        updatedAt: stat.updatedAt,
      },
    };
  }

  async getStatsById(id: string) {
    const stat = await this.statsDataService.getStatsById(id);
    if (!stat) {
      throw new NotFoundException(`Stat with ID ${id} not found`);
    }
    return {
      stat: {
        _id: stat._id.toString(),
        count: stat.count,
        label: stat.label,
        imageUrl: stat.imageUrl,
        active: stat.active,
        createdAt: stat.createdAt,
        updatedAt: stat.updatedAt,
      },
    };
  }

  async updateStats(id: string, updateStatsDto: Partial<CreateStatsDto & { imageUrl: string }>) {
    const stat = await this.statsDataService.updateStats(id, updateStatsDto);
    if (!stat) {
      throw new NotFoundException(`Stat with ID ${id} not found`);
    }
    return {
      stat: {
        _id: stat._id.toString(),
        count: stat.count,
        label: stat.label,
        imageUrl: stat.imageUrl,
        active: stat.active,
        createdAt: stat.createdAt,
        updatedAt: stat.updatedAt,
      },
    };
  }

  async deleteStats(id: string) {
    const stat = await this.statsDataService.deleteStats(id);
    if (!stat) {
      throw new NotFoundException(`Stat with ID ${id} not found`);
    }
    return { message: 'Stat deleted successfully' };
  }
}