import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return await this.associationModel.findById(id).exec();
  }

  async updateAssociation(id: string, data: any): Promise<AssociationDocument | null> {
    return await this.associationModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
  }

  async deleteAssociation(id: string): Promise<void> {
    const result = await this.associationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
  }
}