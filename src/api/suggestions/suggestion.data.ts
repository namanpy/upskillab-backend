import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Suggestion,
  SuggestionDocument,
} from '../../schemas/suggestion.schema';
import {
  CreateSuggestionDTO,
  UpdateSuggestionDTO,
} from '../../dto/suggestion.dto';

@Injectable()
export class SuggestionDataService {
  constructor(
    @InjectModel(Suggestion.name)
    private suggestionModel: Model<SuggestionDocument>,
  ) {}

  async createSuggestion(
    createSuggestionDto: CreateSuggestionDTO & {
      teacherId: string;
      content: string;
    },
  ): Promise<SuggestionDocument> {
    const suggestion = new this.suggestionModel({
      ...createSuggestionDto,
      teacherId: new Types.ObjectId(createSuggestionDto.teacherId),
      batchId: new Types.ObjectId(createSuggestionDto.batchId),
      isApproved: false,
    });
    const savedSuggestion = await suggestion.save();
    return savedSuggestion.populate(['batchId', 'teacherId']);
  }

  async getSuggestionsByBatch(
    batchIds: string[] = [],
    isApproved: boolean,
  ): Promise<SuggestionDocument[]> {
    console.log('batchIds', batchIds, isApproved);
    return this.suggestionModel
      .find({
        batchId: { $in: batchIds.map((b) => new Types.ObjectId(b)) },
        isApproved,
      })
      .populate(['batchId', 'teacherId'])
      .lean()
      .exec();
  }

  async getSuggestionsByTeacher(
    teacherId: string,
  ): Promise<SuggestionDocument[]> {
    return this.suggestionModel
      .find({ teacherId })
      .populate(['batchId', 'teacherId'])
      .lean()
      .exec();
  }

  async getAllSuggestions(): Promise<SuggestionDocument[]> {
    return this.suggestionModel
      .find()
      .populate(['batchId', 'teacherId'])
      .lean()
      .exec();
  }

  async updateSuggestion(
    id: string,
    updateSuggestionDto: Partial<UpdateSuggestionDTO>,
  ): Promise<SuggestionDocument | null> {
    return this.suggestionModel
      .findByIdAndUpdate(id, updateSuggestionDto, { new: true })
      .populate(['batchId', 'teacherId'])
      .lean()
      .exec();
  }

  async deleteSuggestion(id: string): Promise<SuggestionDocument | null> {
    return this.suggestionModel.findByIdAndDelete(id).lean().exec();
  }

  async getSuggestionById(id: string): Promise<SuggestionDocument | null> {
    return this.suggestionModel
      .findById(id)
      .populate(['batchId', 'teacherId'])
      .lean()
      .exec();
  }
}
