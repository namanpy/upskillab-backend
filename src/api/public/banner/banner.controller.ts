import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { BannerLogicService } from './banner.logic';
import { CreateBannerDto, UpdateBannerDto, GetBannersResponseDTO } from '../../../dto/home/banner.dto';
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

  @ApiResponse({ status: 200, description: 'Get all banners', type: GetBannersResponseDTO })
  @Get('')
  async getBanners(): Promise<GetBannersResponseDTO> {
    return await this.bannerLogicService.getBanners();
  }

  @ApiResponse({ status: 201, description: 'Create a new banner with image upload' })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createBanner(@Body() createBannerDto: CreateBannerDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(file, 'banners', Date.now().toString());
    const bannerData = { ...createBannerDto, imageUrl } as CreateBannerDto & { imageUrl: string };

    const createdBanner = await this.bannerLogicService.createBanner(bannerData);
    return {
      ...createdBanner,
      imageUrl, // Ensure imageUrl is returned
    };
  }

  @ApiResponse({ status: 200, description: 'Get a single banner by ID' })
  @Get(':id')
  async getBannerById(@Param('id') id: string) {
    return await this.bannerLogicService.getBannerById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a banner by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateBanner(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let bannerData: Partial<UpdateBannerDto & { imageUrl?: string }> = { ...updateBannerDto };

    let newImageUrl: string | undefined;
    if (file) {
      newImageUrl = await this.imageUploaderService.uploadImage(file, 'banners', `${id}-${Date.now()}`);
      bannerData = { ...bannerData, imageUrl: newImageUrl };
    } else if (!bannerData.imageUrl) {
      const existingBanner = await this.bannerLogicService.getBannerById(id);
      if (existingBanner && existingBanner.banner.imageUrl) {
        bannerData.imageUrl = existingBanner.banner.imageUrl;
      }
    }

    const updatedBanner = await this.bannerLogicService.updateBanner(id, bannerData);
    return {
      ...updatedBanner,
      imageUrl: newImageUrl || updatedBanner.banner.imageUrl, // Return new or existing imageUrl
    };
  }

  @ApiResponse({ status: 200, description: 'Partially update a banner by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async patchBanner(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let bannerData: Partial<UpdateBannerDto & { imageUrl?: string }> = { ...updateBannerDto };

    let newImageUrl: string | undefined;
    if (file) {
      newImageUrl = await this.imageUploaderService.uploadImage(file, 'banners', `${id}-${Date.now()}`);
      bannerData = { ...bannerData, imageUrl: newImageUrl };
    } else if (!bannerData.imageUrl) {
      const existingBanner = await this.bannerLogicService.getBannerById(id);
      if (existingBanner && existingBanner.banner.imageUrl) {
        bannerData.imageUrl = existingBanner.banner.imageUrl;
      }
    }

    const updatedBanner = await this.bannerLogicService.updateBanner(id, bannerData);
    return {
      ...updatedBanner,
      imageUrl: newImageUrl || updatedBanner.banner.imageUrl, // Return new or existing imageUrl
    };
  }

  @ApiResponse({ status: 200, description: 'Delete a banner by ID' })
  @Delete(':id')
  async deleteBanner(@Param('id') id: string) {
    return await this.bannerLogicService.deleteBanner(id);
  }
}