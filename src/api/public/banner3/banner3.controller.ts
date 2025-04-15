import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { Banner3LogicService } from './banner3.logic';
import { CreateBanner3Dto, UpdateBanner3Dto, GetBanner3sResponseDTO } from '../../../dto/home/banner3.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';

@ApiTags('banner3s')
@Controller('banner3s')
export class Banner3Controller {
  constructor(
    private banner3LogicService: Banner3LogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all banners', type: GetBanner3sResponseDTO })
  @Get('')
  async getBanner3s(): Promise<GetBanner3sResponseDTO> {
    return await this.banner3LogicService.getBanner3s();
  }

  @ApiResponse({ status: 201, description: 'Create a new banner with image upload' })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createBanner3(@Body() createBanner3Dto: CreateBanner3Dto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(file, 'banner3s', Date.now().toString());
    const bannerData = { ...createBanner3Dto, imageUrl };

    const createdBanner = await this.banner3LogicService.createBanner3(bannerData as CreateBanner3Dto & { imageUrl: string });
    return {
      ...createdBanner,
      imageUrl, // Ensure imageUrl is returned
    };
  }

  @ApiResponse({ status: 200, description: 'Get a single banner by ID' })
  @Get(':id')
  async getBanner3ById(@Param('id') id: string) {
    return await this.banner3LogicService.getBanner3ById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a banner by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateBanner3(
    @Param('id') id: string,
    @Body() updateBanner3Dto: UpdateBanner3Dto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let bannerData: Partial<UpdateBanner3Dto & { imageUrl?: string }> = { ...updateBanner3Dto };

    let newImageUrl: string | undefined;
    if (file) {
      newImageUrl = await this.imageUploaderService.uploadImage(file, 'banner3s', `${id}-${Date.now()}`);
      bannerData = { ...bannerData, imageUrl: newImageUrl };
    } else if (!bannerData.imageUrl) {
      const existingBanner = await this.banner3LogicService.getBanner3ById(id);
      if (existingBanner && existingBanner.banner3.imageUrl) {
        bannerData.imageUrl = existingBanner.banner3.imageUrl;
      }
    }

    const updatedBanner = await this.banner3LogicService.updateBanner3(id, bannerData);
    return {
      ...updatedBanner,
      imageUrl: newImageUrl || updatedBanner.banner3.imageUrl, // Return new or existing imageUrl
    };
  }

  @ApiResponse({ status: 200, description: 'Partially update a banner by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async patchBanner3(
    @Param('id') id: string,
    @Body() updateBanner3Dto: UpdateBanner3Dto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let bannerData: Partial<UpdateBanner3Dto & { imageUrl?: string }> = { ...updateBanner3Dto };

    let newImageUrl: string | undefined;
    if (file) {
      newImageUrl = await this.imageUploaderService.uploadImage(file, 'banner3s', `${id}-${Date.now()}`);
      bannerData = { ...bannerData, imageUrl: newImageUrl };
    } else if (!bannerData.imageUrl) {
      const existingBanner = await this.banner3LogicService.getBanner3ById(id);
      if (existingBanner && existingBanner.banner3.imageUrl) {
        bannerData.imageUrl = existingBanner.banner3.imageUrl;
      }
    }

    const updatedBanner = await this.banner3LogicService.updateBanner3(id, bannerData);
    return {
      ...updatedBanner,
      imageUrl: newImageUrl || updatedBanner.banner3.imageUrl, // Return new or existing imageUrl
    };
  }

  @ApiResponse({ status: 200, description: 'Delete a banner by ID' })
  @Delete(':id')
  async deleteBanner3(@Param('id') id: string) {
    return await this.banner3LogicService.deleteBanner3(id);
  }
}