import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
  } from '@nestjs/common';
import { FAQLogicService } from './faq.logic';
import { CreateFAQDto, GetFAQsResponseDTO } from '../../dto/home/faq.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('faqs')
@Controller('faqs')
export class FAQController {
  constructor(private faqLogicService: FAQLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all FAQs',
    type: GetFAQsResponseDTO,
  })
  @Get('')
  async getFAQs(): Promise<GetFAQsResponseDTO> {
    return await this.faqLogicService.getFAQs();
  }

  @ApiResponse({
    status: 201,
    description: 'Create a new FAQ',
  })
  @Post('')
  async createFAQ(@Body() createFAQDto: CreateFAQDto) {
    return await this.faqLogicService.createFAQ(createFAQDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get a single FAQ by ID',
  })
  @Get(':id')
  async getFAQById(@Param('id') id: string) {
    return await this.faqLogicService.getFAQById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a FAQ by ID',
  })
  @Put(':id')
  async updateFAQ(
    @Param('id') id: string,
    @Body() updateFAQDto: Partial<CreateFAQDto>,
  ) {
    return await this.faqLogicService.updateFAQ(id, updateFAQDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a FAQ by ID',
  })
  @Delete(':id')
  async deleteFAQ(@Param('id') id: string) {
    return await this.faqLogicService.deleteFAQ(id);
  }
}