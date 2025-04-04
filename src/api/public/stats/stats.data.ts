import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stats, StatsDocument } from '../../../schemas/home/stats.schema';
import { CreateStatsDto } from '../../../dto/home/stats.dto';

@Injectable()
export class StatsDataService {
  constructor(
    @InjectModel(Stats.name) private statsModel: Model<StatsDocument>,
  ) {}

  async getStats(): Promise<StatsDocument[]> {
    return this.statsModel.find().exec();
  }

  async createStats(createStatsDto: CreateStatsDto & { imageUrl: string }): Promise<StatsDocument> {
    const newStats = new this.statsModel(createStatsDto);
    return newStats.save();
  }

  async getStatsById(id: string): Promise<StatsDocument | null> {
    return this.statsModel.findById(id).exec();
  }

  async updateStats(
    id: string,
    updateStatsDto: Partial<CreateStatsDto & { imageUrl: string }>,
  ): Promise<StatsDocument | null> {
    return this.statsModel
      .findByIdAndUpdate(id, updateStatsDto, { new: true })
      .exec();
  }

  async deleteStats(id: string): Promise<StatsDocument | null> {
    return this.statsModel.findByIdAndDelete(id).exec();
  }
}