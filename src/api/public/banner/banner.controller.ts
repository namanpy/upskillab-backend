// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
//   UploadedFile,
//   UseInterceptors,
//   BadRequestException,
// } from '@nestjs/common';
// import { BannerLogicService } from './banner.logic';
// import { CreateBannerDto } from '../../../dto/home/banner.dto';
// import { GetBannersResponseDTO } from '../../../dto/home/banner.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ImageUploaderService } from '../../../common/services/image-uploader.service';

// @ApiTags('banners')
// @Controller('banners')
// export class BannerController {
//   constructor(
//     private bannerLogicService: BannerLogicService,
//     private imageUploaderService: ImageUploaderService, // Inject ImageUploaderService
//   ) {}

//   @ApiResponse({
//     status: 200,
//     description: 'Get all banners',
//     type: GetBannersResponseDTO,
//   })
//   @Get('')
//   async getBanners(): Promise<GetBannersResponseDTO> {
//     return await this.bannerLogicService.getBanners();
//   }

//   @ApiResponse({
//     status: 201,
//     description: 'Create a new banner with image upload',
//   })
//   @Post('')
//   @UseInterceptors(FileInterceptor('image')) // Add FileInterceptor to handle image upload
//   async createBanner(
//     @Body() createBannerDto: CreateBannerDto,
//     @UploadedFile() file: Express.Multer.File, // Get the uploaded file
//   ) {
//     // Validate that a file is provided
//     if (!file) {
//       throw new BadRequestException('Image file is required');
//     }

//     // Validate file type (only allow images)
//     const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (!allowedMimeTypes.includes(file.mimetype)) {
//       throw new BadRequestException('Only JPEG, PNG, and GIF images are allowed');
//     }

//     // Upload the image to S3 using ImageUploaderService
//     const imageUrl = await this.imageUploaderService.uploadImage(file, 'banners', Date.now().toString());

//     // Add the image URL to the DTO
//     const updatedBannerDto = { ...createBannerDto, imageUrl };

//     // Save the banner to the database
//     return await this.bannerLogicService.createBanner(updatedBannerDto);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Get a single banner by ID',
//   })
//   @Get(':id')
//   async getBannerById(@Param('id') id: string) {
//     return await this.bannerLogicService.getBannerById(id);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Update a banner by ID',
//   })
//   @Put(':id')
//   async updateBanner(
//     @Param('id') id: string,
//     @Body() updateBannerDto: Partial<CreateBannerDto>,
//   ) {
//     return await this.bannerLogicService.updateBanner(id, updateBannerDto);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Delete a banner by ID',
//   })
//   @Delete(':id')
//   async deleteBanner(@Param('id') id: string) {
//     return await this.bannerLogicService.deleteBanner(id);
//   }
// }


import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { BannerLogicService } from './banner.logic';
import { CreateBannerDto } from '../../../dto/home/banner.dto';
import { GetBannersResponseDTO } from '../../../dto/home/banner.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';

@ApiTags('banners')
@Controller('banners')
export class BannerController {
  constructor(
    private bannerLogicService: BannerLogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Get all banners',
    type: GetBannersResponseDTO,
  })
  @Get('')
  async getBanners(): Promise<GetBannersResponseDTO> {
    return await this.bannerLogicService.getBanners();
  }

  @ApiResponse({
    status: 201,
    description: 'Create a new banner with image upload',
  })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createBanner(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Validate file type (only allow images)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and GIF images are allowed');
    }

    // Convert active to boolean if it's a string
    const activeValue = (createBannerDto.active as any) as string; // Temporarily cast to string
    if (typeof activeValue === 'string') {
      createBannerDto.active = activeValue.toLowerCase() === 'true';
    } else if (typeof createBannerDto.active !== 'boolean') {
      throw new BadRequestException('Active must be a boolean value');
    }

    // Upload the image to S3
    const imageUrl = await this.imageUploaderService.uploadImage(file, 'banners', Date.now().toString());

    // Add imageUrl to the DTO
    const bannerData = { ...createBannerDto, imageUrl };

    // Save the banner to the database
    return await this.bannerLogicService.createBanner(bannerData);
  }

  @ApiResponse({
    status: 200,
    description: 'Get a single banner by ID',
  })
  @Get(':id')
  async getBannerById(@Param('id') id: string) {
    return await this.bannerLogicService.getBannerById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a banner by ID',
  })
  @Put(':id')
  async updateBanner(
    @Param('id') id: string,
    @Body() updateBannerDto: Partial<CreateBannerDto>,
  ) {
    return await this.bannerLogicService.updateBanner(id, updateBannerDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a banner by ID',
  })
  @Delete(':id')
  async deleteBanner(@Param('id') id: string) {
    return await this.bannerLogicService.deleteBanner(id);
  }
}