import { Injectable, NotFoundException } from '@nestjs/common';
import { BannerDataService } from './banner.data';
import { CreateBannerDto } from '../../../dto/home/banner.dto';
import { GetBannersResponseDTO } from '../../../dto/home/banner.dto';
// import { BannerDocument } from '../../schemas/banner.schema';

@Injectable()
export class BannerLogicService {
  constructor(private bannerDataService: BannerDataService) {}

  async getBanners(): Promise<GetBannersResponseDTO> {
    const banners = await this.bannerDataService.getBanners();
    return {
      banners: banners.map((banner) => ({
        _id: banner._id.toString(),
        title: banner.title,
        description: banner.description,
        imageUrl: banner.imageUrl,
        active: banner.active,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt,
      })),
    };
  }

  async createBanner(createBannerDto: CreateBannerDto) {
    const banner = await this.bannerDataService.createBanner(createBannerDto);
    return {
      banner: {
        _id: banner._id.toString(),
        title: banner.title,
        description: banner.description,
        imageUrl: banner.imageUrl,
        active: banner.active,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt,
      },
    };
  }

  async getBannerById(id: string) {
    const banner = await this.bannerDataService.getBannerById(id);
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return {
      banner: {
        _id: banner._id.toString(),
        title: banner.title,
        description: banner.description,
        imageUrl: banner.imageUrl,
        active: banner.active,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt,
      },
    };
  }

  async updateBanner(id: string, updateBannerDto: Partial<CreateBannerDto>) {
    const banner = await this.bannerDataService.updateBanner(id, updateBannerDto);
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return {
      banner: {
        _id: banner._id.toString(),
        title: banner.title,
        description: banner.description,
        imageUrl: banner.imageUrl,
        active: banner.active,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt,
      },
    };
  }

  async deleteBanner(id: string) {
    const banner = await this.bannerDataService.deleteBanner(id);
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return { message: 'Banner deleted successfully' };
  }
}