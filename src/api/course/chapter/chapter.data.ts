import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Chapter,
  ChapterDocument,
} from '../../../schemas/course/chapter.schema';
import { StringifyObjectId } from 'src/common/types/common.types';

@Injectable()
export class ChapterDataService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<ChapterDocument>,
  ) {}

  async getChapters(courseId: string) {
    return this.chapterModel
      .find({ course: courseId })
      .sort({ chapterNumber: 1 })
      .lean()
      .exec();
  }

  async createChapter(
    createChapterDto: Omit<StringifyObjectId<Chapter>, '_id'>,
  ) {
    const newChapter = new this.chapterModel(createChapterDto);
    return newChapter.save();
  }

  async getChapterById(id: string) {
    return this.chapterModel.findById(id).lean().exec();
  }

  async updateChapter(
    id: string,
    updateChapterDto: Partial<StringifyObjectId<ChapterDocument>>,
  ) {
    return this.chapterModel
      .findByIdAndUpdate(id, updateChapterDto, { new: true })
      .exec();
  }

  async deleteChapter(id: string) {
    return this.chapterModel.findByIdAndDelete(id).exec();
  }
}
