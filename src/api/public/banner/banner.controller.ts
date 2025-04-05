import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { BannerLogicService } from './banner.logic';
import { CreateBannerDto, GetBannersResponseDTO } from '../../../dto/home/banner.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';

@ApiTags('banners') // Updated tag to plural
@Controller('banners') // Changed from 'banner' to 'banners'
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
    const bannerData = { ...createBannerDto, imageUrl }; // subtitle is included in createBannerDto

    return await this.bannerLogicService.createBanner(bannerData);
  }

  @ApiResponse({ status: 200, description: 'Get a single banner by ID' })
  @Get(':id')
  async getBannerById(@Param('id') id: string) {
    return await this.bannerLogicService.getBannerById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a banner by ID' })
  @Put(':id')
  async updateBanner(@Param('id') id: string, @Body() updateBannerDto: Partial<CreateBannerDto>) {
    return await this.bannerLogicService.updateBanner(id, updateBannerDto);
  }

  @ApiResponse({ status: 200, description: 'Delete a banner by ID' })
  @Delete(':id')
  async deleteBanner(@Param('id') id: string) {
    return await this.bannerLogicService.deleteBanner(id);
  }
}