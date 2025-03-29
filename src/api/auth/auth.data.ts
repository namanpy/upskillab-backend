// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

// import { User } from 'src/schemas/user.schema';
// import { CustomError } from 'src/common/classes/error.class';
// import { ERROR } from 'src/common/constants/error.constants';

// @Injectable()
// export class UserDataService {
//   constructor(@InjectModel(User.name) private userModel: Model<User>) {}

//   async getUserById(userId: string) {
//     const user = await this.userModel.findById(userId).lean().exec();
//     if (!user) throw new CustomError(ERROR.USER_NOT_FOUND);
//     return user;
//   }
// }
