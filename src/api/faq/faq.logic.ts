import { Injectable, NotFoundException } from '@nestjs/common';
import { FAQDataService } from './faq.data';
import { CreateFAQDto, GetFAQsResponseDTO } from '../../dto/home/faq.dto';
// import { GetFAQsResponseDTO } from '../../../dto/faq.dto';
// import { FAQDocument } from '../../../schemas/faq.schema';

@Injectable()
export class FAQLogicService {
  constructor(private faqDataService: FAQDataService) {}

  async getFAQs(): Promise<GetFAQsResponseDTO> {
    const faqs = await this.faqDataService.getFAQs();
    return {
      faqs: faqs.map((faq) => ({
        _id: faq._id.toString(),
        title: faq.title,
        description: faq.description,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
      })),
    };
  }

  async createFAQ(createFAQDto: CreateFAQDto) {
    const faq = await this.faqDataService.createFAQ(createFAQDto);
    return {
      faq: {
        _id: faq._id.toString(),
        title: faq.title,
        description: faq.description,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
      },
    };
  }

  async getFAQById(id: string) {
    const faq = await this.faqDataService.getFAQById(id);
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return {
      faq: {
        _id: faq._id.toString(),
        title: faq.title,
        description: faq.description,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
      },
    };
  }

  async updateFAQ(id: string, updateFAQDto: Partial<CreateFAQDto>) {
    const faq = await this.faqDataService.updateFAQ(id, updateFAQDto);
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return {
      faq: {
        _id: faq._id.toString(),
        title: faq.title,
        description: faq.description,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
      },
    };
  }

  async deleteFAQ(id: string) {
    const faq = await this.faqDataService.deleteFAQ(id);
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return { message: 'FAQ deleted successfully' };
  }
}