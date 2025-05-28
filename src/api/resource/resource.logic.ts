import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ResourceDataService } from './resource.data.service';
import {
  CreateResourceDto,
  UpdateResourceDto,
  Resource,
  GetResourcesResponseDTO,
} from '../../dto/resource.dto';
import { ResourceDocument } from '../../schemas/resource.schema';
import { USER_TYPES } from '../../common/constants/user.constants';
import { FileUploaderService } from '../../common/services/file-uploader.service';
import { ImageUploaderService } from '../../common/services/image-uploader.service';
import { User } from 'src/schemas/user.schema';
import { Types } from 'mongoose';
import { NotificationLogicService } from '../notification/notification.logic';
@Injectable()
export class ResourceLogicService {
  constructor(
    private resourceDataService: ResourceDataService,
    private fileUploaderService: FileUploaderService,
    private imageUploaderService: ImageUploaderService,
    private notificationLogicService: NotificationLogicService,
  ) {}

  // Helper function to convert ResourceDocument to Resource DTO
  private convertToResourceDTO(doc: any): Resource {
    const resource = doc.toObject ? doc.toObject() : { ...doc };

    return {
      ...resource,
      _id: resource._id?.toString(),
      createdBy: resource.createdBy?.toString(),
      // courseId: resource.courseId && typeof resource.courseId === 'object' && resource.courseId.toString
      //   ? resource.courseId.toString()
      //   : resource.courseId,
      createdAt: resource.createdAt || new Date(),
      updatedAt: resource.updatedAt || new Date(),
    };
  }

  async getResources(user: User): Promise<GetResourcesResponseDTO> {
    let userId: Types.ObjectId | undefined;
    if (user.userType === USER_TYPES.TEACHER) userId = user._id;

    const resourceDocs = await this.resourceDataService.getResources(userId);
    // Convert each document to Resource DTO
    const resources = resourceDocs.map((doc) => this.convertToResourceDTO(doc));

    return {
      resources: resources,
    };
  }

  async createResource(
    createResourceDto: CreateResourceDto,
    user: any,
    pdfFile?: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ) {
    if (![USER_TYPES.TEACHER, USER_TYPES.ADMIN].includes(user.userType)) {
      throw new ForbiddenException(
        'Only teachers or admins can create resources',
      );
    }

    let pdfUrl: string | undefined;
    let imageUrl: string | undefined;

    if (pdfFile) {
      const uploadResult = await this.fileUploaderService.uploadFiles(
        [pdfFile],
        'resources',
      );
      pdfUrl = uploadResult[0].fileUrl; // Get URL from the first result
    }

    if (imageFile) {
      const fileId =
        Date.now().toString() + Math.random().toString(36).substring(2, 15);
      imageUrl = await this.imageUploaderService.uploadImage(
        imageFile,
        'resource',
        fileId,
      );
    }

    const resourceData = {
    ...createResourceDto,
    isApproved: user.userType === USER_TYPES.TEACHER ? false : createResourceDto.isApproved,
  };

    const resourceDoc = await this.resourceDataService.createResource(
      resourceData,
      user._id,
      pdfUrl,
      imageUrl,
      
    );

    await this.notificationLogicService.createNotification({
      message: `New Resource Created Check out`,
      role: 'admin',
      type: 'resource'
    });
    return {
      resource: this.convertToResourceDTO(resourceDoc),
    };
  }

  async getResourceById(id: string) {
    const resourceDoc = await this.resourceDataService.getResourceById(id);
    if (!resourceDoc) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return {
      resource: this.convertToResourceDTO(resourceDoc),
    };
  }

  async updateResource(
    id: string,
    updateResourceDto: UpdateResourceDto,
    user: any,
    pdfFile?: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ) {
    const resourceDoc = await this.resourceDataService.getResourceById(id);
    if (!resourceDoc) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    const resource = resourceDoc.toObject
      ? resourceDoc.toObject()
      : { ...resourceDoc };
    if (
      resource.createdBy.toString() !== user._id.toString() &&
      user.userType !== USER_TYPES.ADMIN
    ) {
      throw new ForbiddenException('You can only update your own resources');
    }

    let pdfUrl: string | undefined;
    let imageUrl: string | undefined;

    if (pdfFile) {
      const uploadResult = await this.fileUploaderService.uploadFiles(
        [pdfFile],
        'resources',
      );
      pdfUrl = uploadResult[0].fileUrl; // Get URL from the first result
    }

    if (imageFile) {
      const fileId =
        Date.now().toString() + Math.random().toString(36).substring(2, 15);
      imageUrl = await this.imageUploaderService.uploadImage(
        imageFile,
        'resource',
        fileId,
      );
    }

    const updatedResourceDoc = await this.resourceDataService.updateResource(
      id,
      updateResourceDto,
      pdfUrl,
      imageUrl,
    );
    if (!updatedResourceDoc) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    await this.notificationLogicService.createNotification({
      message: `Resource Updated Check out`,
      role: 'admin',
      type: 'resource'
    });
    return {
      resource: this.convertToResourceDTO(updatedResourceDoc),
    };
  }

  async deleteResource(id: string, user: any) {
    const resourceDoc = await this.resourceDataService.getResourceById(id);
    if (!resourceDoc) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    const resource = resourceDoc.toObject
      ? resourceDoc.toObject()
      : { ...resourceDoc };
    if (
      resource.createdBy.toString() !== user._id.toString() &&
      user.userType !== USER_TYPES.ADMIN
    ) {
      throw new ForbiddenException('You can only delete your own resources');
    }

    await this.resourceDataService.deleteResource(id);
    return { message: 'Resource deleted successfully' };
  }
}
