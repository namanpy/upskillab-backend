// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Banner3DataService } from './banner3.data';
// import { CreateBanner3Dto, GetBanner3sResponseDTO, Banner3 } from '../../../dto/home/banner3.dto';
// import { Banner3Document } from '../../../schemas/home/banner3.schema';
// import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

// @Injectable()
// export class Banner3LogicService {
//   constructor(private banner3DataService: Banner3DataService) {}

//   private mapToDto(banner3: Banner3Document): Banner3 {
//     return mapToDto<Banner3, Banner3Document>(banner3);
//   }

//   private mapToDtoArray(banner3s: Banner3Document[]): Banner3[] {
//     return mapToDtoArray<Banner3, Banner3Document>(banner3s);
//   }

//   async getBanner3s(): Promise<GetBanner3sResponseDTO> {
//     const banner3s = await this.banner3DataService.getBanner3s();
//     return {
//       banner3s: this.mapToDtoArray(banner3s),
//     };
//   }

//   async createBanner3(createBanner3Dto: CreateBanner3Dto & { imageUrl: string }) {
//     const banner3 = await this.banner3DataService.createBanner3(createBanner3Dto);
//     return {
//       banner3: this.mapToDto(banner3),
//     };
//   }

//   async getBanner3ById(id: string) {
//     const banner3 = await this.banner3DataService.getBanner3ById(id);
//     if (!banner3) {
//       throw new NotFoundException(`Banner3 with ID ${id} not found`);
//     }
//     return {
//       banner3: this.mapToDto(banner3),
//     };
//   }

//   async updateBanner3(id: string, updateBanner3Dto: Partial<CreateBanner3Dto & { imageUrl: string }>) {
//     const banner3 = await this.banner3DataService.updateBanner3(id, updateBanner3Dto);
//     if (!banner3) {
//       throw new NotFoundException(`Banner3 with ID ${id} not found`);
//     }
//     return {
//       banner3: this.mapToDto(banner3),
//     };
//   }

//   async deleteBanner3(id: string) {
//     const banner3 = await this.banner3DataService.deleteBanner3(id);
//     if (!banner3) {
//       throw new NotFoundException(`Banner3 with ID ${id} not found`);
//     }
//     return { message: 'Banner3 deleted successfully' };
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { Banner3DataService } from './banner3.data';
import { CreateBanner3Dto, GetBanner3sResponseDTO, Banner3 } from '../../../dto/home/banner3.dto';
import { Banner3Document } from '../../../schemas/home/banner3.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

@Injectable()
export class Banner3LogicService {
  constructor(private banner3DataService: Banner3DataService) {}

  private mapToDto(banner3: Banner3Document): Banner3 {
    return mapToDto<Banner3, Banner3Document>(banner3);
  }

  private mapToDtoArray(banner3s: Banner3Document[]): Banner3[] {
    return mapToDtoArray<Banner3, Banner3Document>(banner3s);
  }

  async getBanner3s(): Promise<GetBanner3sResponseDTO> {
    const banner3s = await this.banner3DataService.getBanner3s();
    return {
      banner3s: this.mapToDtoArray(banner3s),
    };
  }

  async createBanner3(createBanner3Dto: CreateBanner3Dto & { imageUrl: string }) {
    const banner3 = await this.banner3DataService.createBanner3(createBanner3Dto);
    return {
      banner3: this.mapToDto(banner3),
    };
  }

  async getBanner3ById(id: string) {
    const banner3 = await this.banner3DataService.getBanner3ById(id);
    if (!banner3) {
      throw new NotFoundException(`Banner3 with ID ${id} not found`);
    }
    return {
      banner3: this.mapToDto(banner3),
    };
  }

  async updateBanner3(id: string, updateBanner3Dto: Partial<CreateBanner3Dto & { imageUrl: string }>) {
    const banner3 = await this.banner3DataService.updateBanner3(id, updateBanner3Dto);
    if (!banner3) {
      throw new NotFoundException(`Banner3 with ID ${id} not found`);
    }
    return {
      banner3: this.mapToDto(banner3),
    };
  }

  async deleteBanner3(id: string) {
    const banner3 = await this.banner3DataService.deleteBanner3(id);
    if (!banner3) {
      throw new NotFoundException(`Banner3 with ID ${id} not found`);
    }
    return { message: 'Banner3 deleted successfully' };
  }
}