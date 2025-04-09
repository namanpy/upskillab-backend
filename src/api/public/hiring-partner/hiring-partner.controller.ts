// import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
// import { HiringPartnerLogicService } from './hiring-partner.logic';
// import { CreateHiringPartnerDto, GetHiringPartnersResponseDTO } from '../../../dto/home/hiring-partner.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ImageUploaderService } from '../../../common/services/image-uploader.service';

// @ApiTags('hiring-partners')
// @Controller('hiring-partners')
// export class HiringPartnerController {
//   constructor(
//     private hiringPartnerLogicService: HiringPartnerLogicService,
//     private imageUploaderService: ImageUploaderService,
//   ) {}

//   @ApiResponse({ status: 200, description: 'Get all hiring partners', type: GetHiringPartnersResponseDTO })
//   @Get('')
//   async getHiringPartners(): Promise<GetHiringPartnersResponseDTO> {
//     return await this.hiringPartnerLogicService.getHiringPartners();
//   }

//   @ApiResponse({ status: 201, description: 'Create a new hiring partner with logo upload' })
//   @Post('')
//   @UseInterceptors(FileInterceptor('logo'))
//   async createHiringPartner(@Body() createHiringPartnerDto: CreateHiringPartnerDto, @UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException('Logo file is required');
//     }

//     const logo = await this.imageUploaderService.uploadImage(file, 'hiring-partners', Date.now().toString());
//     const hiringPartnerData = { ...createHiringPartnerDto, logo };

//     return await this.hiringPartnerLogicService.createHiringPartner(hiringPartnerData);
//   }

//   @ApiResponse({ status: 200, description: 'Get a single hiring partner by ID' })
//   @Get(':id')
//   async getHiringPartnerById(@Param('id') id: string) {
//     return await this.hiringPartnerLogicService.getHiringPartnerById(id);
//   }

//   @ApiResponse({ status: 200, description: 'Update a hiring partner by ID' })
//   @Put(':id')
//   async updateHiringPartner(@Param('id') id: string, @Body() updateHiringPartnerDto: Partial<CreateHiringPartnerDto>) {
//     return await this.hiringPartnerLogicService.updateHiringPartner(id, updateHiringPartnerDto);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a hiring partner by ID' })
//   @Delete(':id')
//   async deleteHiringPartner(@Param('id') id: string) {
//     return await this.hiringPartnerLogicService.deleteHiringPartner(id);
//   }
// }


import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { HiringPartnerLogicService } from './hiring-partner.logic';
import { CreateHiringPartnerDto, GetHiringPartnersResponseDTO } from '../../../dto/home/hiring-partner.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';

@ApiTags('hiring-partners')
@Controller('hiring-partners')
export class HiringPartnerController {
  constructor(
    private hiringPartnerLogicService: HiringPartnerLogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all hiring partners', type: GetHiringPartnersResponseDTO })
  @Get('')
  async getHiringPartners(): Promise<GetHiringPartnersResponseDTO> {
    return await this.hiringPartnerLogicService.getHiringPartners();
  }

  @ApiResponse({ status: 201, description: 'Create a new hiring partner with logo upload' })
  @Post('')
  @UseInterceptors(FileInterceptor('logo'))
  async createHiringPartner(
    @Body() createHiringPartnerDto: CreateHiringPartnerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Logo file is required');
    }

    const logo = await this.imageUploaderService.uploadImage(file, 'hiring-partners', Date.now().toString());
    const hiringPartnerData = { ...createHiringPartnerDto, logo };

    return await this.hiringPartnerLogicService.createHiringPartner(hiringPartnerData);
  }

  @ApiResponse({ status: 200, description: 'Get a single hiring partner by ID' })
  @Get(':id')
  async getHiringPartnerById(@Param('id') id: string) {
    return await this.hiringPartnerLogicService.getHiringPartnerById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a hiring partner by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async updateHiringPartner(
    @Param('id') id: string,
    @Body() updateHiringPartnerDto: Partial<CreateHiringPartnerDto>,
    @UploadedFile() file?: Express.Multer.File, // Logo is optional
  ) {
    let hiringPartnerData: Partial<CreateHiringPartnerDto & { logo: string }> = { ...updateHiringPartnerDto };

    if (file) {
      const logo = await this.imageUploaderService.uploadImage(file, 'hiring-partners', `${id}-${Date.now()}`);
      hiringPartnerData = { ...hiringPartnerData, logo };
    }

    return await this.hiringPartnerLogicService.updateHiringPartner(id, hiringPartnerData);
  }

  @ApiResponse({ status: 200, description: 'Partially update a hiring partner by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async patchHiringPartner(
    @Param('id') id: string,
    @Body() updateHiringPartnerDto: Partial<CreateHiringPartnerDto>,
    @UploadedFile() file?: Express.Multer.File, // Logo is optional
  ) {
    let hiringPartnerData: Partial<CreateHiringPartnerDto & { logo: string }> = { ...updateHiringPartnerDto };

    if (file) {
      const logo = await this.imageUploaderService.uploadImage(file, 'hiring-partners', `${id}-${Date.now()}`);
      hiringPartnerData = { ...hiringPartnerData, logo };
    }

    return await this.hiringPartnerLogicService.updateHiringPartner(id, hiringPartnerData);
  }

  @ApiResponse({ status: 200, description: 'Delete a hiring partner by ID' })
  @Delete(':id')
  async deleteHiringPartner(@Param('id') id: string) {
    return await this.hiringPartnerLogicService.deleteHiringPartner(id);
  }
}