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
  Query,
} from '@nestjs/common';
import { BatchLogicService } from './batch.logic';
import {
  CreateBatchDto,
  GetUpcomingBatchesRequestDTO,
  GetUpcomingBatchesResponseDTO,
} from '../../dto/course/batch.dto';
import { GetBatchesResponseDTO } from '../../dto/course/batch.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../common/services/image-uploader.service';
import { TransformBooleanPipe } from '../../common/pipes/transform-boolean.pipe';

@ApiTags('batches')
@Controller('batches')
export class BatchController {
  constructor(
    private batchLogicService: BatchLogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Get all batches',
    type: GetBatchesResponseDTO,
  })
  @Get('')
  async getBatches(): Promise<GetBatchesResponseDTO> {
    return await this.batchLogicService.getBatches();
  }

  @ApiResponse({
    status: 200,
    description: 'Get all batches',
    type: [GetUpcomingBatchesResponseDTO],
  })
  @Get('upcoming')
  async geUpcomingBatches(
    @Query() query: GetUpcomingBatchesRequestDTO,
  ): Promise<GetUpcomingBatchesResponseDTO[]> {
    return this.batchLogicService.getUpcomingBatches(query);
  }

  @ApiResponse({
    status: 201,
    description: 'Create a new batch with image upload',
  })
  // @Post('')
  // @UseInterceptors(FileInterceptor('image'))
  // @UsePipes(new TransformBooleanPipe())
  // async createBatch(
  //   @Body() createBatchDto: CreateBatchDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   if (!file) {
  //     throw new BadRequestException('Image file is required');
  //   }

  //   const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  //   if (!allowedMimeTypes.includes(file.mimetype)) {
  //     throw new BadRequestException(
  //       'Only JPEG, PNG, and GIF images are allowed',
  //     );
  //   }

  //   const imageUrl = await this.imageUploaderService.uploadImage(
  //     file,
  //     'batches',
  //     Date.now().toString(),
  //   );
  //   const batchData = { ...createBatchDto, imageUrl };

  //   return await this.batchLogicService.createBatch(batchData);
  // }

  @Post('')
@UsePipes(new TransformBooleanPipe())
async createBatch(@Body() createBatchDto: CreateBatchDto) {
  return await this.batchLogicService.createBatch(createBatchDto);
}

  @ApiResponse({
    status: 200,
    description: 'Get a single batch by ID',
  })
  @Get(':id')
  async getBatchById(@Param('id') id: string) {
    return await this.batchLogicService.getBatchById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a batch by ID',
  })
  @Put(':id')
  async updateBatch(
    @Param('id') id: string,
    @Body() updateBatchDto: Partial<CreateBatchDto>,
  ) {
    return await this.batchLogicService.updateBatch(id, updateBatchDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a batch by ID',
  })
  @Delete(':id')
  async deleteBatch(@Param('id') id: string) {
    return await this.batchLogicService.deleteBatch(id);
  }
}
