import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial } from '../../schemas/testimonial.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserDataService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async users(username: string | null) {
    return this.userModel
    .find({
      name : username,
    })
    .exec();
  }
  async email(userEmail: string | null) {
    return this.userModel
    .find({
      name : userEmail,
    })
    .exec();
  }
}
