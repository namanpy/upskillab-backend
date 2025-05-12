import { Module } from '@nestjs/common';
import { ResourceLogicService } from './resource.logic';
import { ResourceController } from './resource.controller';
import { ResourceDataService } from './resource.data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Resource, ResourceSchema } from '../../schemas/resource.schema';
import { FileUploaderService } from '../../common/services/file-uploader.service';
import { ImageUploaderService } from '../../common/services/image-uploader.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resource.name, schema: ResourceSchema }]),
  ],
  controllers: [ResourceController],
  providers: [ResourceLogicService, ResourceDataService, FileUploaderService, ImageUploaderService],
})
export class ResourceModule {}