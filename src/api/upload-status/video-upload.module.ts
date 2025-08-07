import { Module } from '@nestjs/common';
import { UploadController } from './video-upload.controller';
import { UploadService } from './video-upload.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class uploadModule {}
