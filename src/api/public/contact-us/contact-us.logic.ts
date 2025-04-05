import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactUsDataService } from './contact-us.data';
import { CreateContactUsDto, GetContactUsResponseDTO, ContactUs } from '../../../dto/home/contact-us.dto';
import { ContactUsDocument } from '../../../schemas/home/contact-us.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

@Injectable()
export class ContactUsLogicService {
  constructor(private contactUsDataService: ContactUsDataService) {}

  private mapToDto(contactUs: ContactUsDocument): ContactUs {
    return mapToDto<ContactUs, ContactUsDocument>(contactUs);
  }

  private mapToDtoArray(contactUsEntries: ContactUsDocument[]): ContactUs[] {
    return mapToDtoArray<ContactUs, ContactUsDocument>(contactUsEntries);
  }

  async getContactUsEntries(): Promise<GetContactUsResponseDTO> {
    const contactUsEntries = await this.contactUsDataService.getContactUsEntries();
    return {
      contactUs: this.mapToDtoArray(contactUsEntries),
    };
  }

  async createContactUs(createContactUsDto: CreateContactUsDto) {
    const contactUs = await this.contactUsDataService.createContactUs(createContactUsDto);
    return {
      contactUs: this.mapToDto(contactUs),
    };
  }

  async getContactUsById(id: string) {
    const contactUs = await this.contactUsDataService.getContactUsById(id);
    if (!contactUs) {
      throw new NotFoundException(`ContactUs entry with ID ${id} not found`);
    }
    return {
      contactUs: this.mapToDto(contactUs),
    };
  }

  async updateContactUs(id: string, updateContactUsDto: Partial<CreateContactUsDto>) {
    const contactUs = await this.contactUsDataService.updateContactUs(id, updateContactUsDto);
    if (!contactUs) {
      throw new NotFoundException(`ContactUs entry with ID ${id} not found`);
    }
    return {
      contactUs: this.mapToDto(contactUs),
    };
  }

  async deleteContactUs(id: string) {
    const contactUs = await this.contactUsDataService.deleteContactUs(id);
    if (!contactUs) {
      throw new NotFoundException(`ContactUs entry with ID ${id} not found`);
    }
    return { message: 'ContactUs entry deleted successfully' };
  }
}