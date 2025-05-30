
import { Injectable, NotFoundException } from '@nestjs/common';
import { AssociationDataService } from './associations.data';
import { CreateAssociationDto, UpdateAssociationDto, AssociationResponse, GetAssociationsResponseDTO } from '../../../dto/associations.dto';
import { Types } from 'mongoose';

@Injectable()
export class AssociationLogicService {
  constructor(
    private associationDataService: AssociationDataService,
  ) {}

  private mapToResponse(association: any): AssociationResponse {
    return {
      _id: association._id.toString(),
      logo: association.logo,
      title: association.title,
      description: association.description,
      isActive: association.isActive,
      createdAt: association.createdAt,
      updatedAt: association.updatedAt,
    };
  }

  async getAssociations(): Promise<GetAssociationsResponseDTO> {
    const associations = await this.associationDataService.getAssociations();
    return {
      associations: associations.map(association => this.mapToResponse(association)),
    };
  }

  async getAssociationById(id: string): Promise<{ association: AssociationResponse }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid association ID');
    }
    const association = await this.associationDataService.getAssociationById(id);
    if (!association) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
    return {
      association: this.mapToResponse(association),
    };
  }

  async createAssociation(createAssociationDto: CreateAssociationDto): Promise<{ association: AssociationResponse }> {
    const associationData = {
      logo: createAssociationDto.logo,
      title: createAssociationDto.title,
      description: createAssociationDto.description,
      isActive: createAssociationDto.isActive,
    };

    const association = await this.associationDataService.createAssociation(associationData);
    return {
      association: this.mapToResponse(association),
    };
  }

  async updateAssociation(id: string, updateAssociationDto: UpdateAssociationDto): Promise<{ association: AssociationResponse }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid association ID');
    }
    const associationData = {
      logo: updateAssociationDto.logo,
      title: updateAssociationDto.title,
      description: updateAssociationDto.description,
      isActive: updateAssociationDto.isActive,
    };

    const association = await this.associationDataService.updateAssociation(id, associationData);
    if (!association) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
    return {
      association: this.mapToResponse(association),
    };
  }

  async deleteAssociation(id: string): Promise<{ message: string } > {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid association ID');
    }
    return await this.associationDataService.deleteAssociation(id);
  }
}