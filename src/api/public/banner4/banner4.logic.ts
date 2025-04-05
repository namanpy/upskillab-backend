import { Injectable, NotFoundException } from '@nestjs/common';
import { Banner4DataService } from './banner4.data';
import { CreateBanner4Dto, GetBanner4sResponseDTO, Banner4 } from '../../../dto/home/banner4.dto';
import { Banner4Document } from '../../../schemas/home/banner4.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

@Injectable()
export class Banner4LogicService {
  constructor(private banner4DataService: Banner4DataService) {}

  private mapToDto(banner4: Banner4Document): Banner4 {
    return mapToDto<Banner4, Banner4Document>(banner4);
  }

  private mapToDtoArray(banner4s: Banner4Document[]): Banner4[] {
    return mapToDtoArray<Banner4, Banner4Document>(banner4s);
  }

  async getBanner4s(): Promise<GetBanner4sResponseDTO> {
    const banner4s = await this.banner4DataService.getBanner4s();
    return {
      banner4s: this.mapToDtoArray(banner4s),
    };
  }

  async createBanner4(createBanner4Dto: CreateBanner4Dto & { imageUrl: string }) {
    const banner4 = await this.banner4DataService.createBanner4(createBanner4Dto);
    return {
      banner4: this.mapToDto(banner4),
    };
  }

  async getBanner4ById(id: string) {
    const banner4 = await this.banner4DataService.getBanner4ById(id);
    if (!banner4) {
      throw new NotFoundException(`Banner4 with ID ${id} not found`);
    }
    return {
      banner4: this.mapToDto(banner4),
    };
  }

  async updateBanner4(id: string, updateBanner4Dto: Partial<CreateBanner4Dto & { imageUrl: string }>) {
    const banner4 = await this.banner4DataService.updateBanner4(id, updateBanner4Dto);
    if (!banner4) {
      throw new NotFoundException(`Banner4 with ID ${id} not found`);
    }
    return {
      banner4: this.mapToDto(banner4),
    };
  }

  async deleteBanner4(id: string) {
    const banner4 = await this.banner4DataService.deleteBanner4(id);
    if (!banner4) {
      throw new NotFoundException(`Banner4 with ID ${id} not found`);
    }
    return { message: 'Banner4 deleted successfully' };
  }
}