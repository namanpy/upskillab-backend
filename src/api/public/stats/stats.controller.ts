import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { StatsLogicService } from './stats.logic';
import { CreateStatsDto } from '../../../dto/home/stats.dto';
import { GetStatsResponseDTO } from '../../../dto/home/stats.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';
import { TransformBooleanPipe } from '../../../common/pipes/transform-boolean.pipe';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(
    private statsLogicService: StatsLogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Get all stats',
    type: GetStatsResponseDTO,
  })
  @Get('')
  async getStats(): Promise<GetStatsResponseDTO> {
    return await this.statsLogicService.getStats();
  }

  @ApiResponse({
    status: 201,
    description: 'Create a new stat with image upload',
  })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(new TransformBooleanPipe()) // Apply the pipe
  async createStats(
    @Body() createStatsDto: CreateStatsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and GIF images are allowed');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(file, 'stats', Date.now().toString());
    const statsData = { ...createStatsDto, imageUrl };

    return await this.statsLogicService.createStats(statsData);
  }

  @ApiResponse({
    status: 200,
    description: 'Get a single stat by ID',
  })
  @Get(':id')
  async getStatsById(@Param('id') id: string) {
    return await this.statsLogicService.getStatsById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a stat by ID',
  })
  @Put(':id')
  async updateStats(
    @Param('id') id: string,
    @Body() updateStatsDto: Partial<CreateStatsDto>,
  ) {
    return await this.statsLogicService.updateStats(id, updateStatsDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a stat by ID',
  })
  @Delete(':id')
  async deleteStats(@Param('id') id: string) {
    return await this.statsLogicService.deleteStats(id);
  }
}