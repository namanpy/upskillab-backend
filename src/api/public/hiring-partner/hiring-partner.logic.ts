import { Injectable, NotFoundException } from '@nestjs/common';
import { HiringPartnerDataService } from './hiring-partner.data';
import { CreateHiringPartnerDto, GetHiringPartnersResponseDTO, HiringPartner } from '../../../dto/home/hiring-partner.dto';
import { HiringPartnerDocument } from '../../../schemas/home/hiring-partner.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

@Injectable()
export class HiringPartnerLogicService {
  constructor(private hiringPartnerDataService: HiringPartnerDataService) {}

  private mapToDto(hiringPartner: HiringPartnerDocument): HiringPartner {
    return mapToDto<HiringPartner, HiringPartnerDocument>(hiringPartner);
  }

  private mapToDtoArray(hiringPartners: HiringPartnerDocument[]): HiringPartner[] {
    return mapToDtoArray<HiringPartner, HiringPartnerDocument>(hiringPartners);
  }

  async getHiringPartners(): Promise<GetHiringPartnersResponseDTO> {
    const hiringPartners = await this.hiringPartnerDataService.getHiringPartners();
    return {
      hiringPartners: this.mapToDtoArray(hiringPartners),
    };
  }

  async createHiringPartner(createHiringPartnerDto: CreateHiringPartnerDto & { logo: string }) {
    const hiringPartner = await this.hiringPartnerDataService.createHiringPartner(createHiringPartnerDto);
    return {
      hiringPartner: this.mapToDto(hiringPartner),
    };
  }

  async getHiringPartnerById(id: string) {
    const hiringPartner = await this.hiringPartnerDataService.getHiringPartnerById(id);
    if (!hiringPartner) {
      throw new NotFoundException(`HiringPartner with ID ${id} not found`);
    }
    return {
      hiringPartner: this.mapToDto(hiringPartner),
    };
  }

  async updateHiringPartner(id: string, updateHiringPartnerDto: Partial<CreateHiringPartnerDto & { logo: string }>) {
    const hiringPartner = await this.hiringPartnerDataService.updateHiringPartner(id, updateHiringPartnerDto);
    if (!hiringPartner) {
      throw new NotFoundException(`HiringPartner with ID ${id} not found`);
    }
    return {
      hiringPartner: this.mapToDto(hiringPartner),
    };
  }

  async deleteHiringPartner(id: string) {
    const hiringPartner = await this.hiringPartnerDataService.deleteHiringPartner(id);
    if (!hiringPartner) {
      throw new NotFoundException(`HiringPartner with ID ${id} not found`);
    }
    return { message: 'HiringPartner deleted successfully' };
  }
}