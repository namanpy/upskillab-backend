import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploaderService } from '../../common/services/file-uploader.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private fileUploaderService: FileUploaderService) {}

  @ApiResponse({
    status: 201,
    description: 'Upload multiple files',
    type: Object,
  })
  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Query() input: { attachment?: boolean; attachmentName?: string },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }

    const uploadedFiles = await this.fileUploaderService.uploadFiles(
      files,
      'files',
      input,
    );

    return {
      files: uploadedFiles,
    };
  }
}
