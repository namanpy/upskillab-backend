import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
  } from '@nestjs/common';
import { ChapterLogicService } from './chapter.logic';
import { CreateChapterDto } from '../../dto/course/chapter.dto';
import { GetChaptersResponseDTO } from '../../dto/course/chapter.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('chapters')
@Controller('courses/:courseId/chapters')
export class ChapterController {
  constructor(private chapterLogicService: ChapterLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all chapters for a course',
    type: GetChaptersResponseDTO,
  })
  @Get('')
  async getChapters(@Param('courseId') courseId: string): Promise<GetChaptersResponseDTO> {
    return await this.chapterLogicService.getChapters(courseId);
  }

  @ApiResponse({
    status: 201,
    description: 'Create a new chapter',
  })
  @Post('')
  async createChapter(
    @Param('courseId') courseId: string,
    @Body() createChapterDto: CreateChapterDto,
  ) {
    createChapterDto.courseId = courseId;
    return await this.chapterLogicService.createChapter(createChapterDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get a single chapter by ID',
  })
  @Get(':id')
  async getChapterById(@Param('id') id: string) {
    return await this.chapterLogicService.getChapterById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a chapter by ID',
  })
  @Put(':id')
  async updateChapter(
    @Param('id') id: string,
    @Body() updateChapterDto: Partial<CreateChapterDto>,
  ) {
    return await this.chapterLogicService.updateChapter(id, updateChapterDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a chapter by ID',
  })
  @Delete(':id')
  async deleteChapter(@Param('id') id: string) {
    return await this.chapterLogicService.deleteChapter(id);
  }
}