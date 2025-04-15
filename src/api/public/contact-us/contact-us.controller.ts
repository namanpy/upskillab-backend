// import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
// import { ContactUsLogicService } from './contact-us.logic';
// import { CreateContactUsDto, GetContactUsResponseDTO } from '../../../dto/home/contact-us.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';

// @ApiTags('contact-us')
// @Controller('contact-us')
// export class ContactUsController {
//   constructor(private contactUsLogicService: ContactUsLogicService) {}

//   @ApiResponse({ status: 200, description: 'Get all contact-us entries', type: GetContactUsResponseDTO })
//   @Get('')
//   async getContactUsEntries(): Promise<GetContactUsResponseDTO> {
//     return await this.contactUsLogicService.getContactUsEntries();
//   }

//   @ApiResponse({ status: 201, description: 'Create a new contact-us entry' })
//   @Post('')
//   async createContactUs(@Body() createContactUsDto: CreateContactUsDto) {
//     return await this.contactUsLogicService.createContactUs(createContactUsDto);
//   }

//   @ApiResponse({ status: 200, description: 'Get a single contact-us entry by ID' })
//   @Get(':id')
//   async getContactUsById(@Param('id') id: string) {
//     return await this.contactUsLogicService.getContactUsById(id);
//   }

//   @ApiResponse({ status: 200, description: 'Update a contact-us entry by ID' })
//   @Put(':id')
//   async updateContactUs(@Param('id') id: string, @Body() updateContactUsDto: Partial<CreateContactUsDto>) {
//     return await this.contactUsLogicService.updateContactUs(id, updateContactUsDto);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a contact-us entry by ID' })
//   @Delete(':id')
//   async deleteContactUs(@Param('id') id: string) {
//     return await this.contactUsLogicService.deleteContactUs(id);
//   }
// }

import { Controller, Get, Post, Put, Patch, Delete, Body, Param } from '@nestjs/common';
import { ContactUsLogicService } from './contact-us.logic';
import { CreateContactUsDto, GetContactUsResponseDTO } from '../../../dto/home/contact-us.dto';
import { ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('contact-us')
@Controller('contact-us')
export class ContactUsController {
  constructor(private contactUsLogicService: ContactUsLogicService) {}

  @ApiResponse({ status: 200, description: 'Get all contact-us entries', type: GetContactUsResponseDTO })
  @Get('')
  async getContactUsEntries(): Promise<GetContactUsResponseDTO> {
    return await this.contactUsLogicService.getContactUsEntries();
  }

  @ApiResponse({ status: 201, description: 'Create a new contact-us entry', type: CreateContactUsDto })
  @Post('')
  async createContactUs(@Body() createContactUsDto: CreateContactUsDto) {
    return await this.contactUsLogicService.createContactUs(createContactUsDto);
  }

  @ApiResponse({ status: 200, description: 'Get a single contact-us entry by ID', type: CreateContactUsDto })
  @Get(':id')
  async getContactUsById(@Param('id') id: string) {
    return await this.contactUsLogicService.getContactUsById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a contact-us entry by ID', type: CreateContactUsDto })
  @ApiBody({ type: CreateContactUsDto, required: false, description: 'Partial update of contact-us entry' })
  @Put(':id')
  async updateContactUs(@Param('id') id: string, @Body() updateContactUsDto: Partial<CreateContactUsDto>) {
    return await this.contactUsLogicService.updateContactUs(id, updateContactUsDto);
  }

  @ApiResponse({ status: 200, description: 'Partially update a contact-us entry by ID', type: CreateContactUsDto })
  @ApiBody({ type: CreateContactUsDto, required: false, description: 'Partial update of contact-us entry' })
  @Patch(':id')
  async patchContactUs(@Param('id') id: string, @Body() updateContactUsDto: Partial<CreateContactUsDto>) {
    return await this.contactUsLogicService.updateContactUs(id, updateContactUsDto);
  }

  @ApiResponse({ status: 200, description: 'Delete a contact-us entry by ID' })
  @Delete(':id')
  async deleteContactUs(@Param('id') id: string) {
    return await this.contactUsLogicService.deleteContactUs(id);
  }
}