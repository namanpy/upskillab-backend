// import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
// import { Banner4LogicService } from './banner4.logic';
// import { CreateBanner4Dto, GetBanner4sResponseDTO } from '../../../dto/home/banner4.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ImageUploaderService } from '../../../common/services/image-uploader.service';

// @ApiTags('banner4')
// @Controller('banner4')
// export class Banner4Controller {
//   constructor(
//     private banner4LogicService: Banner4LogicService,
//     private imageUploaderService: ImageUploaderService,
//   ) {}

//   @ApiResponse({ status: 200, description: 'Get all banner4s', type: GetBanner4sResponseDTO })
//   @Get('')
//   async getBanner4s(): Promise<GetBanner4sResponseDTO> {
//     return await this.banner4LogicService.getBanner4s();
//   }

//   @ApiResponse({ status: 201, description: 'Create a new banner4 with image upload' })
//   @Post('')
//   @UseInterceptors(FileInterceptor('image'))
//   async createBanner4(@Body() createBanner4Dto: CreateBanner4Dto, @UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException('Image file is required');
//     }

//     const imageUrl = await this.imageUploaderService.uploadImage(file, 'banner4', Date.now().toString());
//     const banner4Data = { ...createBanner4Dto, imageUrl };

//     return await this.banner4LogicService.createBanner4(banner4Data);
//   }

//   @ApiResponse({ status: 200, description: 'Get a single banner4 by ID' })
//   @Get(':id')
//   async getBanner4ById(@Param('id') id: string) {
//     return await this.banner4LogicService.getBanner4ById(id);
//   }

//   @ApiResponse({ status: 200, description: 'Update a banner4 by ID' })
//   @Put(':id')
//   async updateBanner4(@Param('id') id: string, @Body() updateBanner4Dto: Partial<CreateBanner4Dto>) {
//     return await this.banner4LogicService.updateBanner4(id, updateBanner4Dto);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a banner4 by ID' })
//   @Delete(':id')
//   async deleteBanner4(@Param('id') id: string) {
//     return await this.banner4LogicService.deleteBanner4(id);
//   }
// }


import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { Banner4LogicService } from './banner4.logic';
import { CreateBanner4Dto, GetBanner4sResponseDTO } from '../../../dto/home/banner4.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';

@ApiTags('banner4')
@Controller('banner4')
export class Banner4Controller {
  constructor(
    private banner4LogicService: Banner4LogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all banner4s', type: GetBanner4sResponseDTO })
  @Get('')
  async getBanner4s(): Promise<GetBanner4sResponseDTO> {
    return await this.banner4LogicService.getBanner4s();
  }

  @ApiResponse({ status: 201, description: 'Create a new banner4 with image upload' })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createBanner4(
    @Body() createBanner4Dto: CreateBanner4Dto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(file, 'banner4s', Date.now().toString());
    const banner4Data = { ...createBanner4Dto, imageUrl };

    return await this.banner4LogicService.createBanner4(banner4Data);
  }

  @ApiResponse({ status: 200, description: 'Get a single banner4 by ID' })
  @Get(':id')
  async getBanner4ById(@Param('id') id: string) {
    return await this.banner4LogicService.getBanner4ById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a banner4 by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateBanner4(
    @Param('id') id: string,
    @Body() updateBanner4Dto: Partial<CreateBanner4Dto>,
    @UploadedFile() file?: Express.Multer.File, // Image is optional
  ) {
    let banner4Data: Partial<CreateBanner4Dto & { imageUrl: string }> = { ...updateBanner4Dto };

    if (file) {
      const imageUrl = await this.imageUploaderService.uploadImage(file, 'banner4s', `${id}-${Date.now()}`);
      banner4Data = { ...banner4Data, imageUrl };
    }

    return await this.banner4LogicService.updateBanner4(id, banner4Data);
  }

  @ApiResponse({ status: 200, description: 'Partially update a banner4 by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async patchBanner4(
    @Param('id') id: string,
    @Body() updateBanner4Dto: Partial<CreateBanner4Dto>,
    @UploadedFile() file?: Express.Multer.File, // Image is optional
  ) {
    let banner4Data: Partial<CreateBanner4Dto & { imageUrl: string }> = { ...updateBanner4Dto };

    if (file) {
      const imageUrl = await this.imageUploaderService.uploadImage(file, 'banner4s', `${id}-${Date.now()}`);
      banner4Data = { ...banner4Data, imageUrl };
    }

    return await this.banner4LogicService.updateBanner4(id, banner4Data);
  }

  @ApiResponse({ status: 200, description: 'Delete a banner4 by ID' })
  @Delete(':id')
  async deleteBanner4(@Param('id') id: string) {
    return await this.banner4LogicService.deleteBanner4(id);
  }
}