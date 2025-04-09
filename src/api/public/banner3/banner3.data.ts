// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Banner3, Banner3Document } from '../../../schemas/home/banner3.schema';
// import { CreateBanner3Dto } from '../../../dto/home/banner3.dto';

// @Injectable()
// export class Banner3DataService {
//   constructor(@InjectModel(Banner3.name) private banner3Model: Model<Banner3Document>) {}

//   async getBanner3s(): Promise<Banner3Document[]> {
//     return this.banner3Model.find().exec();
//   }

//   async createBanner3(createBanner3Dto: CreateBanner3Dto & { imageUrl: string }): Promise<Banner3Document> {
//     const newBanner3 = new this.banner3Model(createBanner3Dto);
//     return newBanner3.save();
//   }

//   async getBanner3ById(id: string): Promise<Banner3Document | null> {
//     return this.banner3Model.findById(id).exec();
//   }

//   async updateBanner3(id: string, updateBanner3Dto: Partial<CreateBanner3Dto & { imageUrl: string }>): Promise<Banner3Document | null> {
//     return this.banner3Model.findByIdAndUpdate(id, updateBanner3Dto, { new: true }).exec();
//   }

//   async deleteBanner3(id: string): Promise<Banner3Document | null> {
//     return this.banner3Model.findByIdAndDelete(id).exec();
//   }
// }


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner3, Banner3Document } from '../../../schemas/home/banner3.schema';
import { CreateBanner3Dto } from '../../../dto/home/banner3.dto';

@Injectable()
export class Banner3DataService {
  constructor(@InjectModel(Banner3.name) private banner3Model: Model<Banner3Document>) {}

  async getBanner3s(): Promise<Banner3Document[]> {
    return this.banner3Model.find().exec();
  }

  async createBanner3(createBanner3Dto: CreateBanner3Dto & { imageUrl: string }): Promise<Banner3Document> {
    const newBanner3 = new this.banner3Model(createBanner3Dto);
    return newBanner3.save();
  }

  async getBanner3ById(id: string): Promise<Banner3Document | null> {
    return this.banner3Model.findById(id).exec();
  }

  async updateBanner3(id: string, updateBanner3Dto: Partial<CreateBanner3Dto & { imageUrl: string }>): Promise<Banner3Document | null> {
    return this.banner3Model.findByIdAndUpdate(id, updateBanner3Dto, { new: true }).exec();
  }

  async deleteBanner3(id: string): Promise<Banner3Document | null> {
    return this.banner3Model.findByIdAndDelete(id).exec();
  }
}