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
  const suggestionData: any = {
    ...createSuggestionDto,
    teacherId: new Types.ObjectId(createSuggestionDto.teacherId),
    isApproved: false,
  };

  if (createSuggestionDto.batchId) {
    suggestionData.batchId = new Types.ObjectId(createSuggestionDto.batchId);
  }

  const suggestion = new this.suggestionModel(suggestionData);
  const savedSuggestion = await suggestion.save();

  return savedSuggestion.populate(['batchId', 'teacherId']);
}


  async getSuggestionsByBatch(
    batchIds: string[] = [],
    isApproved: boolean,
  ): Promise<SuggestionDocument[]> {

    return this.suggestionModel
      .find({
        batchId: { $in: batchIds.map((b) => new Types.ObjectId(b)) },
        isApproved,
      })
      .populate(['batchId', 'teacherId'])
      .lean()
      .exec();
  }

  async getSuggestionsForStudent(batchIds: string[]): Promise<SuggestionDocument[]> {
  const conditions: any[] = [];

  if (batchIds.length > 0) {
    conditions.push({
      batchId: { $in: batchIds.map((id) => new Types.ObjectId(id)) },
    });
  }

  // Include suggestions with no batchId assigned (public)
  conditions.push({
    batchId: { $exists: false },
  }, {
    batchId: null,
  });

  return this.suggestionModel
    .find({
      isApproved: true,
      $or: conditions,
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
