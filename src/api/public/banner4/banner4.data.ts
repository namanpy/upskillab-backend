// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Banner4, Banner4Document } from '../../../schemas/home/banner4.schema';
// import { CreateBanner4Dto } from '../../../dto/home/banner4.dto';

// @Injectable()
// export class Banner4DataService {
//   constructor(@InjectModel(Banner4.name) private banner4Model: Model<Banner4Document>) {}

//   async getBanner4s(): Promise<Banner4Document[]> {
//     return this.banner4Model.find().exec();
//   }

//   async createBanner4(createBanner4Dto: CreateBanner4Dto & { imageUrl: string }): Promise<Banner4Document> {
//     const newBanner4 = new this.banner4Model(createBanner4Dto);
//     return newBanner4.save();
//   }

//   async getBanner4ById(id: string): Promise<Banner4Document | null> {
//     return this.banner4Model.findById(id).exec();
//   }

//   async updateBanner4(id: string, updateBanner4Dto: Partial<CreateBanner4Dto & { imageUrl: string }>): Promise<Banner4Document | null> {
//     return this.banner4Model.findByIdAndUpdate(id, updateBanner4Dto, { new: true }).exec();
//   }

//   async deleteBanner4(id: string): Promise<Banner4Document | null> {
//     return this.banner4Model.findByIdAndDelete(id).exec();
//   }
// }


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner4, Banner4Document } from '../../../schemas/home/banner4.schema';
import { CreateBanner4Dto } from '../../../dto/home/banner4.dto';

@Injectable()
export class Banner4DataService {
  constructor(@InjectModel(Banner4.name) private banner4Model: Model<Banner4Document>) {}

  async getBanner4s(): Promise<Banner4Document[]> {
    return this.banner4Model.find().exec();
  }

  async createBanner4(createBanner4Dto: CreateBanner4Dto & { imageUrl: string }): Promise<Banner4Document> {
    const newBanner4 = new this.banner4Model(createBanner4Dto);
    return newBanner4.save();
  }

  async getBanner4ById(id: string): Promise<Banner4Document | null> {
    return this.banner4Model.findById(id).exec();
  }

  async updateBanner4(id: string, updateBanner4Dto: Partial<CreateBanner4Dto & { imageUrl: string }>): Promise<Banner4Document | null> {
    return this.banner4Model.findByIdAndUpdate(id, updateBanner4Dto, { new: true }).exec();
  }

  async deleteBanner4(id: string): Promise<Banner4Document | null> {
    return this.banner4Model.findByIdAndDelete(id).exec();
  }
}