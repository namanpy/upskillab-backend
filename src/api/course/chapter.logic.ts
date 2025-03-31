import { Injectable, NotFoundException } from '@nestjs/common';
import { ChapterDataService } from './chapter.data';
import { CreateChapterDto } from '../../dto/course/chapter.dto';
import { GetChaptersResponseDTO } from '../../dto/course/chapter.dto';
// import { ChapterDocument } from '../../schemas/course/chapter.schema';

@Injectable()
export class ChapterLogicService {
  constructor(private chapterDataService: ChapterDataService) {}

  async getChapters(courseId: string): Promise<GetChaptersResponseDTO> {
    const chapters = await this.chapterDataService.getChapters(courseId);
    return {
      chapters: chapters.map((chapter) => ({
        _id: chapter._id.toString(),
        title: chapter.title,
        videoLink: chapter.videoLink, // Changed from description to videoLink
        order: chapter.order,
        courseId: chapter.courseId.toString(),
        isPublished: chapter.isPublished,
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt,
      })),
    };
  }

  async createChapter(createChapterDto: CreateChapterDto) {
    const chapter = await this.chapterDataService.createChapter(createChapterDto);
    return {
      chapter: {
        _id: chapter._id.toString(),
        title: chapter.title,
        videoLink: chapter.videoLink, // Changed from description to videoLink
        order: chapter.order,
        courseId: chapter.courseId.toString(),
        isPublished: chapter.isPublished,
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt,
      },
    };
  }

  async getChapterById(id: string) {
    const chapter = await this.chapterDataService.getChapterById(id);
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return {
      chapter: {
        _id: chapter._id.toString(),
        title: chapter.title,
        videoLink: chapter.videoLink, // Changed from description to videoLink
        order: chapter.order,
        courseId: chapter.courseId.toString(),
        isPublished: chapter.isPublished,
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt,
      },
    };
  }

  async updateChapter(id: string, updateChapterDto: Partial<CreateChapterDto>) {
    const chapter = await this.chapterDataService.updateChapter(id, updateChapterDto);
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return {
      chapter: {
        _id: chapter._id.toString(),
        title: chapter.title,
        videoLink: chapter.videoLink, // Changed from description to videoLink
        order: chapter.order,
        courseId: chapter.courseId.toString(),
        isPublished: chapter.isPublished,
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt,
      },
    };
  }

  async deleteChapter(id: string) {
    const chapter = await this.chapterDataService.deleteChapter(id);
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return { message: 'Chapter deleted successfully' };
  }
}