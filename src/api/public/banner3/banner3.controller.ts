// import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
// import { Banner3LogicService } from './banner3.logic';
// import { CreateBanner3Dto, GetBanner3sResponseDTO } from '../../../dto/home/banner3.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ImageUploaderService } from '../../../common/services/image-uploader.service';

// @ApiTags('banner3')
// @Controller('banner3')
// export class Banner3Controller {
//   constructor(
//     private banner3LogicService: Banner3LogicService,
//     private imageUploaderService: ImageUploaderService,
//   ) {}

//   @ApiResponse({ status: 200, description: 'Get all banner3s', type: GetBanner3sResponseDTO })
//   @Get('')
//   async getBanner3s(): Promise<GetBanner3sResponseDTO> {
//     return await this.banner3LogicService.getBanner3s();
//   }

//   @ApiResponse({ status: 201, description: 'Create a new banner3 with image upload' })
//   @Post('')
//   @UseInterceptors(FileInterceptor('image'))
//   async createBanner3(@Body() createBanner3Dto: CreateBanner3Dto, @UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException('Image file is required');
//     }

//     const imageUrl = await this.imageUploaderService.uploadImage(file, 'banner3', Date.now().toString());
//     const banner3Data = { ...createBanner3Dto, imageUrl };

//     return await this.banner3LogicService.createBanner3(banner3Data);
//   }

//   @ApiResponse({ status: 200, description: 'Get a single banner3 by ID' })
//   @Get(':id')
//   async getBanner3ById(@Param('id') id: string) {
//     return await this.banner3LogicService.getBanner3ById(id);
//   }

//   @ApiResponse({ status: 200, description: 'Update a banner3 by ID' })
//   @Put(':id')
//   async updateBanner3(@Param('id') id: string, @Body() updateBanner3Dto: Partial<CreateBanner3Dto>) {
//     return await this.banner3LogicService.updateBanner3(id, updateBanner3Dto);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a banner3 by ID' })
//   @Delete(':id')
//   async deleteBanner3(@Param('id') id: string) {
//     return await this.banner3LogicService.deleteBanner3(id);
//   }
// }


import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { Banner3LogicService } from './banner3.logic';
import { CreateBanner3Dto, GetBanner3sResponseDTO } from '../../../dto/home/banner3.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';

@ApiTags('banner3')
@Controller('banner3')
export class Banner3Controller {
  constructor(
    private banner3LogicService: Banner3LogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all banner3s', type: GetBanner3sResponseDTO })
  @Get('')
  async getBanner3s(): Promise<GetBanner3sResponseDTO> {
    return await this.banner3LogicService.getBanner3s();
  }

  @ApiResponse({ status: 201, description: 'Create a new banner3 with image upload' })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createBanner3(
    @Body() createBanner3Dto: CreateBanner3Dto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(file, 'banner3s', Date.now().toString());
    const banner3Data = { ...createBanner3Dto, imageUrl };

    return await this.banner3LogicService.createBanner3(banner3Data);
  }

  @ApiResponse({ status: 200, description: 'Get a single banner3 by ID' })
  @Get(':id')
  async getBanner3ById(@Param('id') id: string) {
    return await this.banner3LogicService.getBanner3ById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a banner3 by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateBanner3(
    @Param('id') id: string,
    @Body() updateBanner3Dto: Partial<CreateBanner3Dto>,
    @UploadedFile() file?: Express.Multer.File, // Image is optional
  ) {
    let banner3Data: Partial<CreateBanner3Dto & { imageUrl: string }> = { ...updateBanner3Dto };

    if (file) {
      const imageUrl = await this.imageUploaderService.uploadImage(file, 'banner3s', `${id}-${Date.now()}`);
      banner3Data = { ...banner3Data, imageUrl };
    }

    return await this.banner3LogicService.updateBanner3(id, banner3Data);
  }

  @ApiResponse({ status: 200, description: 'Partially update a banner3 by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async patchBanner3(
    @Param('id') id: string,
    @Body() updateBanner3Dto: Partial<CreateBanner3Dto>,
    @UploadedFile() file?: Express.Multer.File, // Image is optional
  ) {
    let banner3Data: Partial<CreateBanner3Dto & { imageUrl: string }> = { ...updateBanner3Dto };

    if (file) {
      const imageUrl = await this.imageUploaderService.uploadImage(file, 'banner3s', `${id}-${Date.now()}`);
      banner3Data = { ...banner3Data, imageUrl };
    }

    return await this.banner3LogicService.updateBanner3(id, banner3Data);
  }

  @ApiResponse({ status: 200, description: 'Delete a banner3 by ID' })
  @Delete(':id')
  async deleteBanner3(@Param('id') id: string) {
    return await this.banner3LogicService.deleteBanner3(id);
  }
}