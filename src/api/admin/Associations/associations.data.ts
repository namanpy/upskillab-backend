import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Association, AssociationDocument } from '../../../schemas/associations.schema';

@Injectable()
export class AssociationDataService {
  constructor(
    @InjectModel(Association.name) private associationModel: Model<AssociationDocument>,
  ) {}

  async createAssociation(data: any): Promise<AssociationDocument> {
    const association = new this.associationModel(data);
    return await association.save();
  }

  async getAssociations(): Promise<AssociationDocument[]> {
    return await this.associationModel.find().exec();
  }

  async getAssociationById(id: string): Promise<AssociationDocument | null> {
    const objectId = new Types.ObjectId(id);
    return await this.associationModel.findById(objectId).exec();
  }

  async updateAssociation(id: string, data: any): Promise<AssociationDocument | null> {
    const objectId = new Types.ObjectId(id);
    return await this.associationModel
      .findByIdAndUpdate(objectId, { $set: data }, { new: true })
      .exec();
  }

  async deleteAssociation(id: string): Promise<{ message: string }> {
    const objectId = new Types.ObjectId(id);
    const result = await this.associationModel.findByIdAndDelete(objectId).exec();
    return {message : "Deleted Successfully"};
    // if (!result) {
    //   throw new NotFoundException(`Association with ID ${id} not found`);
    // }
  }
}