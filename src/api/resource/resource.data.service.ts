import { Injectable } from '@nestjs/common';
// import { Inject  import { InjectModel } from '@nestjs/mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Resource, ResourceDocument } from '../../schemas/resource.schema';
import { CreateResourceDto, UpdateResourceDto } from '../../dto/resource.dto';
import { Course } from 'src/schemas/course/course.schema';

@Injectable()
export class ResourceDataService {
  constructor(
    @InjectModel(Resource.name) private resourceModel: Model<ResourceDocument>,
  ) {}

  async getResources(userId?: Types.ObjectId) {
    return this.resourceModel
      .find({
        ...(userId && { createdBy: userId }),
      })
      .populate<{ courseId: Course }>('courseId')
      .lean()
      .exec();
  }

  async createResource(
    createResourceDto: CreateResourceDto,
    createdBy: string,
    pdfUrl?: string,
    imageUrl?: string,
  ): Promise<ResourceDocument> {
    const newResource = new this.resourceModel({
      ...createResourceDto,
      pdf: pdfUrl,
      image: imageUrl,
      createdBy,
    });
    return newResource.save();
  }

  async getResourceById(id: string): Promise<ResourceDocument | null> {
    return this.resourceModel.findById(id).populate('courseId').lean().exec();
  }

  async updateResource(
    id: string,
    updateResourceDto: UpdateResourceDto,
    pdfUrl?: string,
    imageUrl?: string,
  ): Promise<ResourceDocument | null> {
    const updateData: any = { ...updateResourceDto };
    if (pdfUrl) updateData.pdf = pdfUrl;
    if (imageUrl) updateData.image = imageUrl;
    return this.resourceModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .lean()
      .exec();
  }

  async deleteResource(id: string): Promise<ResourceDocument | null> {
    return this.resourceModel.findByIdAndDelete(id).exec();
  }
}
