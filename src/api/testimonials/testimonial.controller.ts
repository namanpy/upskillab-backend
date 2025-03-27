import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TestimonialLogicService } from './testimonial.logic';
import { CreateTestimonialDto, GetTestimonialsResponseDTO } from '../../dto/home/testimonial.dto';
// import {  } from '../../dto/testimonial.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialController {
  constructor(private testimonialLogicService: TestimonialLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all testimonials',
    type: GetTestimonialsResponseDTO,
  })
  @Get('')
  async getTestimonials(): Promise<GetTestimonialsResponseDTO> {
    return await this.testimonialLogicService.getTestimonials();
  }

  @ApiResponse({
    status: 201,
    description: 'Create a new testimonial',
  })
  @Post('')
  async createTestimonial(@Body() createTestimonialDto: CreateTestimonialDto) {
    return await this.testimonialLogicService.createTestimonial(createTestimonialDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get a single testimonial by ID',
  })
  @Get(':id')
  async getTestimonialById(@Param('id') id: string) {
    return await this.testimonialLogicService.getTestimonialById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a testimonial by ID',
  })
  @Put(':id')
  async updateTestimonial(
    @Param('id') id: string,
    @Body() updateTestimonialDto: Partial<CreateTestimonialDto>,
  ) {
    return await this.testimonialLogicService.updateTestimonial(id, updateTestimonialDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a testimonial by ID',
  })
  @Delete(':id')
  async deleteTestimonial(@Param('id') id: string) {
    return await this.testimonialLogicService.deleteTestimonial(id);
  }
}