import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileUploaderService } from '../../common/services/file-uploader.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  providers: [FileUploaderService],
  controllers: [FileController],
})
export class FileModule {}