import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MarketingPrompt } from '../../schemas/marketing-prompt.schema';
import {
  CreateMarketingPromptDTO,
  UpdateMarketingPromptDTO,
  MarketingPromptResponseDTO,
} from '../../dto/marketing-prompt.dto';

@Injectable()
export class MarketingPromptService {
  constructor(
    @InjectModel('MarketingPrompt') private marketingPromptModel: Model<MarketingPrompt>,
  ) {}

  async createMarketingPrompt(
    createMarketingPromptDTO: CreateMarketingPromptDTO,
  ): Promise<MarketingPromptResponseDTO> {
    try {
      const marketingPrompt = new this.marketingPromptModel({
        ...createMarketingPromptDTO,
        isActive: createMarketingPromptDTO.isActive ?? true,
      });
      const savedPrompt = await marketingPrompt.save();

      return {
        _id: savedPrompt._id.toString(),
        name: savedPrompt.name,
        image: savedPrompt.image,
        isActive: savedPrompt.isActive,
        createdAt: savedPrompt.createdAt,
        updatedAt: savedPrompt.updatedAt,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create marketing prompt: ' + error.message);
    }
  }

  async getActiveMarketingPrompts(): Promise<MarketingPromptResponseDTO[]> {
    const prompts = await this.marketingPromptModel
      .find({ isActive: true })
      .lean()
      .exec();

    return prompts.map(prompt => ({
      _id: prompt._id.toString(),
      name: prompt.name,
      image: prompt.image,
      isActive: prompt.isActive,
      createdAt: prompt.createdAt as Date,
      updatedAt: prompt.updatedAt as Date,
    }));
  }

  async getAllMarketingPrompts(): Promise<MarketingPromptResponseDTO[]> {
    const prompts = await this.marketingPromptModel.find().lean().exec();

    return prompts.map(prompt => ({
      _id: prompt._id.toString(),
      name: prompt.name,
      image: prompt.image,
      isActive: prompt.isActive,
      createdAt: prompt.createdAt as Date,
      updatedAt: prompt.updatedAt as Date,
    }));
  }

  async updateMarketingPrompt(
    id: string,
    updateMarketingPromptDTO: UpdateMarketingPromptDTO,
  ): Promise<MarketingPromptResponseDTO> {
    try {
      // Validate ObjectId format
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid ObjectId format: ${id}`);
      }

      console.log('Updating marketing prompt with ID:', id);
      console.log('Update data:', updateMarketingPromptDTO);
      console.log('Collection name:', this.marketingPromptModel.collection.name);
    //   console.log('Database name:', this.marketingPromptModel.db.databaseName);

      // Check different ways to find the document
      console.log('--- Debugging findById ---');
      const existingPrompt1 = await this.marketingPromptModel.findById(id).lean().exec();
      console.log('findById result:', existingPrompt1);

      const existingPrompt2 = await this.marketingPromptModel.findOne({ _id: id }).lean().exec();
      console.log('findOne with _id result:', existingPrompt2);

      const existingPrompt3 = await this.marketingPromptModel.findOne({ _id: new Types.ObjectId(id) }).lean().exec();
      console.log('findOne with new ObjectId result:', existingPrompt3);

      // Check all documents in collection
      const allPrompts = await this.marketingPromptModel.find({}, { _id: 1 }).lean().exec();
      console.log('All existing IDs in database:', allPrompts.map(p => p._id.toString()));
      console.log('Total documents found:', allPrompts.length);

      if (!existingPrompt1 && !existingPrompt2 && !existingPrompt3) {
        throw new NotFoundException(`Marketing prompt with ID ${id} not found`);
      }

      const prompt = await this.marketingPromptModel
        .findByIdAndUpdate(id, { $set: updateMarketingPromptDTO }, { new: true })
        .lean()
        .exec();

      if (!prompt) {
        throw new NotFoundException(`Marketing prompt with ID ${id} not found after update`);
      }

      return {
        _id: prompt._id.toString(),
        name: prompt.name,
        image: prompt.image,
        isActive: prompt.isActive,
        createdAt: prompt.createdAt as Date,
        updatedAt: prompt.updatedAt as Date,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update marketing prompt: ' + error.message);
    }
  }

  async deleteMarketingPrompt(id: string): Promise<void> {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ObjectId format: ${id}`);
    }

    const result = await this.marketingPromptModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Marketing prompt with id ${id} not found`);
    }
  }
}