import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ResourceDataService } from './resource.data.service';
import { CreateResourceDto, UpdateResourceDto, Resource, GetResourcesResponseDTO } from '../../dto/resource.dto';
import { ResourceDocument } from '../../schemas/resource.schema';
import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';
import { USER_TYPES } from '../../common/constants/user.constants';
import { FileUploaderService } from '../../common/services/file-uploader.service';
import { ImageUploaderService } from '../../common/services/image-uploader.service';

@Injectable()
export class ResourceLogicService {
  constructor(
    private resourceDataService: ResourceDataService,
    private fileUploaderService: FileUploaderService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  private mapToDto(resource: ResourceDocument): Resource {
    return mapToDto<Resource, ResourceDocument>(resource);
  }

  private mapToDtoArray(resources: ResourceDocument[]): Resource[] {
    return mapToDtoArray<Resource, ResourceDocument>(resources);
  }

  async getResources(): Promise<GetResourcesResponseDTO> {
    const resources = await this.resourceDataService.getResources();
    return {
      resources: this.mapToDtoArray(resources), // Fixed typo: 'funds' to 'resources'
    };
  }

  async createResource(
    createResourceDto: CreateResourceDto,
    user: any,
    pdfFile?: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ) {
    if (![USER_TYPES.TEACHER, USER_TYPES.ADMIN].includes(user.userType)) {
      throw new ForbiddenException('Only teachers or admins can create resources');
    }

    let pdfUrl: string | undefined;
    let imageUrl: string | undefined;

    if (pdfFile) {
      const uploadResult = await this.fileUploaderService.uploadFiles([pdfFile], 'resources');
      pdfUrl = uploadResult[0].fileUrl; // Get URL from the first result
    }

    if (imageFile) {
      const fileId = Date.now().toString() + Math.random().toString(36).substring(2, 15);
      imageUrl = await this.imageUploaderService.uploadImage(imageFile, 'resource', fileId);
    }

    const resource = await this.resourceDataService.createResource(createResourceDto, user._id, pdfUrl, imageUrl);
    return {
      resource: this.mapToDto(resource),
    };
  }

  async getResourceById(id: string) {
    const resource = await this.resourceDataService.getResourceById(id);
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
    return {
      resource: this.mapToDto(resource),
    };
  }

  async updateResource(
    id: string,
    updateResourceDto: UpdateResourceDto,
    user: any,
    pdfFile?: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ) {
    const resource = await this.resourceDataService.getResourceById(id);
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    if (resource.createdBy.toString() !== user._id.toString() && user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('You can only update your own resources');
    }

    let pdfUrl: string | undefined;
    let imageUrl: string | undefined;

    if (pdfFile) {
      const uploadResult = await this.fileUploaderService.uploadFiles([pdfFile], 'resources');
      pdfUrl = uploadResult[0].fileUrl; // Get URL from the first result
    }

    if (imageFile) {
      const fileId = Date.now().toString() + Math.random().toString(36).substring(2, 15);
      imageUrl = await this.imageUploaderService.uploadImage(imageFile, 'resource', fileId);
    }

    const updatedResource = await this.resourceDataService.updateResource(id, updateResourceDto, pdfUrl, imageUrl);
    if (!updatedResource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
    return {
      resource: this.mapToDto(updatedResource),
    };
  }

  async deleteResource(id: string, user: any) {
    const resource = await this.resourceDataService.getResourceById(id);
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    if (resource.createdBy.toString() !== user._id.toString() && user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('You can only delete your own resources');
    }

    await this.resourceDataService.deleteResource(id);
    return { message: 'Resource deleted successfully' };
  }
}