import { Injectable, NotFoundException } from '@nestjs/common';
import { TestimonialDataService } from './testimonial.data';
// import { CreateTestimonialDto } from '../../dto/testimonial.dto';
import { CreateTestimonialDto, GetTestimonialsResponseDTO } from '../../dto//home/testimonial.dto';
// import { TestimonialDocument } from '../../schemas/testimonial.schema';

@Injectable()
export class TestimonialLogicService {
  constructor(private testimonialDataService: TestimonialDataService) {}

  async getTestimonials(): Promise<GetTestimonialsResponseDTO> {
    const testimonials = await this.testimonialDataService.getTestimonials();
    return {
      testimonials: testimonials.map((testimonial) => ({
        _id: testimonial._id.toString(),
        name: testimonial.name,
        testimonialImageUrl: testimonial.testimonialImageUrl,
        email: testimonial.email,
        description: testimonial.description,
        socialMediaLinks: testimonial.socialMediaLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
        })),
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt,
      })),
    };
  }

  async createTestimonial(createTestimonialDto: CreateTestimonialDto) {
    const testimonial = await this.testimonialDataService.createTestimonial(createTestimonialDto);
    return {
      testimonial: {
        _id: testimonial._id.toString(),
        name: testimonial.name,
        testimonialImageUrl: testimonial.testimonialImageUrl,
        email: testimonial.email,
        description: testimonial.description,
        socialMediaLinks: testimonial.socialMediaLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
        })),
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt,
      },
    };
  }

  async getTestimonialById(id: string) {
    const testimonial = await this.testimonialDataService.getTestimonialById(id);
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return {
      testimonial: {
        _id: testimonial._id.toString(),
        name: testimonial.name,
        testimonialImageUrl: testimonial.testimonialImageUrl,
        email: testimonial.email,
        description: testimonial.description,
        socialMediaLinks: testimonial.socialMediaLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
        })),
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt,
      },
    };
  }

  async updateTestimonial(id: string, updateTestimonialDto: Partial<CreateTestimonialDto>) {
    const testimonial = await this.testimonialDataService.updateTestimonial(id, updateTestimonialDto);
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return {
      testimonial: {
        _id: testimonial._id.toString(),
        name: testimonial.name,
        testimonialImageUrl: testimonial.testimonialImageUrl,
        email: testimonial.email,
        description: testimonial.description,
        socialMediaLinks: testimonial.socialMediaLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
        })),
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt,
      },
    };
  }

  async deleteTestimonial(id: string) {
    const testimonial = await this.testimonialDataService.deleteTestimonial(id);
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return { message: 'Testimonial deleted successfully' };
  }
}