import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { Banner4LogicService } from './banner4.logic';
import { CreateBanner4Dto, UpdateBanner4Dto, GetBanner4sResponseDTO } from '../../../dto/home/banner4.dto';
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

  @ApiResponse({ status: 200, description: 'Get all banners', type: GetBanner4sResponseDTO })
  @Get('')
  async getBanner4s(): Promise<GetBanner4sResponseDTO> {
    return await this.banner4LogicService.getBanner4s();
  }

  @ApiResponse({ status: 201, description: 'Create a new banner with image upload' })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createBanner4(@Body() createBanner4Dto: CreateBanner4Dto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(file, 'banner4s', Date.now().toString());
    const bannerData = { ...createBanner4Dto, imageUrl };

    const createdBanner = await this.banner4LogicService.createBanner4(bannerData as CreateBanner4Dto & { imageUrl: string });
    return {
      ...createdBanner,
      imageUrl, // Ensure imageUrl is returned
    };
  }

  @ApiResponse({ status: 200, description: 'Get a single banner by ID' })
  @Get(':id')
  async getBanner4ById(@Param('id') id: string) {
    return await this.banner4LogicService.getBanner4ById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a banner by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateBanner4(
    @Param('id') id: string,
    @Body() updateBanner4Dto: UpdateBanner4Dto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let bannerData: Partial<UpdateBanner4Dto & { imageUrl?: string }> = { ...updateBanner4Dto };

    let newImageUrl: string | undefined;
    if (file) {
      newImageUrl = await this.imageUploaderService.uploadImage(file, 'banner4s', `${id}-${Date.now()}`);
      bannerData = { ...bannerData, imageUrl: newImageUrl };
    } else if (!bannerData.imageUrl) {
      const existingBanner = await this.banner4LogicService.getBanner4ById(id);
      if (existingBanner && existingBanner.banner4.imageUrl) {
        bannerData.imageUrl = existingBanner.banner4.imageUrl;
      }
    }

    const updatedBanner = await this.banner4LogicService.updateBanner4(id, bannerData);
    return {
      ...updatedBanner,
      imageUrl: newImageUrl || updatedBanner.banner4.imageUrl, // Return new or existing imageUrl
    };
  }

  @ApiResponse({ status: 200, description: 'Partially update a banner by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async patchBanner4(
    @Param('id') id: string,
    @Body() updateBanner4Dto: UpdateBanner4Dto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let bannerData: Partial<UpdateBanner4Dto & { imageUrl?: string }> = { ...updateBanner4Dto };

    let newImageUrl: string | undefined;
    if (file) {
      newImageUrl = await this.imageUploaderService.uploadImage(file, 'banner4s', `${id}-${Date.now()}`);
      bannerData = { ...bannerData, imageUrl: newImageUrl };
    } else if (!bannerData.imageUrl) {
      const existingBanner = await this.banner4LogicService.getBanner4ById(id);
      if (existingBanner && existingBanner.banner4.imageUrl) {
        bannerData.imageUrl = existingBanner.banner4.imageUrl;
      }
    }

    const updatedBanner = await this.banner4LogicService.updateBanner4(id, bannerData);
    return {
      ...updatedBanner,
      imageUrl: newImageUrl || updatedBanner.banner4.imageUrl, // Return new or existing imageUrl
    };
  }

  @ApiResponse({ status: 200, description: 'Delete a banner by ID' })
  @Delete(':id')
  async deleteBanner4(@Param('id') id: string) {
    return await this.banner4LogicService.deleteBanner4(id);
  }
}