import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Language, LanguageDocument } from '../../schemas/language.schema';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';

@Injectable()
export class LanguageDataService {
  constructor(
    @InjectModel(Language.name) private languageModel: Model<LanguageDocument>,
  ) {}

  async createLanguage(
    input: Omit<Language, '_id'>,
  ): Promise<LanguageDocument> {
    const existingLanguage = await this.languageModel.findOne({
      languageCode: input.languageCode,
    });

    if (existingLanguage) {
      throw new CustomError(ERROR.LANGUAGE_ALREADY_EXISTS);
    }

    const newLanguage = new this.languageModel(input);
    return newLanguage.save();
  }

  async getLanguages(input: {
    search?: string;
    skip?: number;
    limit?: number;
  }) {
    const { search, skip = 0, limit = 10 } = input;

    const filter = search
      ? {
          $or: [
            { languageName: { $regex: search, $options: 'i' } },
            { languageCode: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [data, count] = await Promise.all([
      this.languageModel.find(filter).skip(skip).limit(limit).lean().exec(),
      this.languageModel.countDocuments(filter),
    ]);

    return { data, count };
  }

  async getLanguageById(id: string) {
    const language = await this.languageModel.findById(id).lean().exec();
    if (!language) throw new CustomError(ERROR.LANGUAGE_NOT_FOUND);
    return language;
  }

  async updateLanguage(
    id: string,
    updateData: Partial<Language>,
  ): Promise<LanguageDocument | null> {
    if (updateData.languageCode) {
      const existingLanguage = await this.languageModel.findOne({
        languageCode: updateData.languageCode,
        _id: { $ne: id },
      });

      if (existingLanguage) {
        throw new CustomError(ERROR.LANGUAGE_ALREADY_EXISTS);
      }
    }

    return this.languageModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .lean()
      .exec();
  }

  async deleteLanguage(id: string): Promise<LanguageDocument | null> {
    return this.languageModel.findByIdAndDelete(id).lean().exec();
  }
}
