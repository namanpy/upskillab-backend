import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial } from '../../schemas/testimonial.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserDataService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
