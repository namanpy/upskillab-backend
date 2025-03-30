import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter, ChapterDocument } from '../../schemas/course/chapter.schema';
import { CreateChapterDto } from '../../dto/course/chapter.dto';

@Injectable()
export class ChapterDataService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<ChapterDocument>,
  ) {}

  async getChapters(courseId: string): Promise<ChapterDocument[]> {
    return this.chapterModel.find({ courseId }).sort({ order: 1 }).exec();
  }

  async createChapter(createChapterDto: CreateChapterDto): Promise<ChapterDocument> {
    const newChapter = new this.chapterModel(createChapterDto);
    return newChapter.save();
  }

  async getChapterById(id: string): Promise<ChapterDocument | null> {
    return this.chapterModel.findById(id).exec();
  }

  async updateChapter(
    id: string,
    updateChapterDto: Partial<CreateChapterDto>,
  ): Promise<ChapterDocument | null> {
    return this.chapterModel
      .findByIdAndUpdate(id, updateChapterDto, { new: true })
      .exec();
  }

  async deleteChapter(id: string): Promise<ChapterDocument | null> {
    return this.chapterModel.findByIdAndDelete(id).exec();
  }
}