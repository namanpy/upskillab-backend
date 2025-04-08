// import { Injectable, NotFoundException } from '@nestjs/common';
// import { BannerDataService } from './banner.data';
// import { CreateBannerDto, GetBannersResponseDTO, Banner } from '../../../dto/home/banner.dto';
// import { BannerDocument } from '../../../schemas/home/banner.schema';
// import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

// @Injectable()
// export class BannerLogicService {
//   constructor(private bannerDataService: BannerDataService) {}

//   private mapToDto(banner: BannerDocument): Banner {
//     return mapToDto<Banner, BannerDocument>(banner);
//   }

//   private mapToDtoArray(banners: BannerDocument[]): Banner[] {
//     return mapToDtoArray<Banner, BannerDocument>(banners);
//   }

//   async getBanners(): Promise<GetBannersResponseDTO> {
//     const banners = await this.bannerDataService.getBanners();
//     return {
//       banners: this.mapToDtoArray(banners),
//     };
//   }

//   async createBanner(createBannerDto: CreateBannerDto & { imageUrl: string }) {
//     const banner = await this.bannerDataService.createBanner(createBannerDto);
//     return {
//       banner: this.mapToDto(banner),
//     };
//   }

//   async getBannerById(id: string) {
//     const banner = await this.bannerDataService.getBannerById(id);
//     if (!banner) {
//       throw new NotFoundException(`Banner with ID ${id} not found`);
//     }
//     return {
//       banner: this.mapToDto(banner),
//     };
//   }

//   async updateBanner(id: string, updateBannerDto: Partial<CreateBannerDto & { imageUrl: string }>) {
//     const banner = await this.bannerDataService.updateBanner(id, updateBannerDto);
//     if (!banner) {
//       throw new NotFoundException(`Banner with ID ${id} not found`);
//     }
//     return {
//       banner: this.mapToDto(banner),
//     };
//   }

//   async deleteBanner(id: string) {
//     const banner = await this.bannerDataService.deleteBanner(id);
//     if (!banner) {
//       throw new NotFoundException(`Banner with ID ${id} not found`);
//     }
//     return { message: 'Banner deleted successfully' };
//   }
// }




import { Injectable, NotFoundException } from '@nestjs/common';
import { BannerDataService } from './banner.data';
import { CreateBannerDto, GetBannersResponseDTO, Banner } from '../../../dto/home/banner.dto';
import { BannerDocument } from '../../../schemas/home/banner.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

@Injectable()
export class BannerLogicService {
  constructor(private bannerDataService: BannerDataService) {}

  private mapToDto(banner: BannerDocument): Banner {
    return mapToDto<Banner, BannerDocument>(banner);
  }

  private mapToDtoArray(banners: BannerDocument[]): Banner[] {
    return mapToDtoArray<Banner, BannerDocument>(banners);
  }

  async getBanners(): Promise<GetBannersResponseDTO> {
    const banners = await this.bannerDataService.getBanners();
    return {
      banners: this.mapToDtoArray(banners),
    };
  }

  async createBanner(createBannerDto: CreateBannerDto & { imageUrl: string }) {
    const banner = await this.bannerDataService.createBanner(createBannerDto);
    return {
      banner: this.mapToDto(banner),
    };
  }

  async getBannerById(id: string) {
    const banner = await this.bannerDataService.getBannerById(id);
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return {
      banner: this.mapToDto(banner),
    };
  }

  async updateBanner(id: string, updateBannerDto: Partial<CreateBannerDto & { imageUrl: string }>) {
    const banner = await this.bannerDataService.updateBanner(id, updateBannerDto);
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return {
      banner: this.mapToDto(banner),
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