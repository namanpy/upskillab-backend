import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Referral,ReferralDocument } from "src/schemas/referral.schema";
import { Types } from 'mongoose';
@Injectable()
export class ReferralDataService {
  constructor(@InjectModel(Referral.name) private model: Model<ReferralDocument>) {}

async getByUserId(userId: any): Promise<ReferralDocument | null> {
    console.log(userId)
  return this.model.findOne({ userId });
}


  async getByCode(referralCode: string) {
    console.log(referralCode)
    return this.model.findOne({ code : referralCode });
  }
  

  async create(data: Partial<Referral>) {
    return this.model.create(data);
  }

  async addCourseToReferral(referralId: Types.ObjectId, courseId: any) {
    return this.model.findByIdAndUpdate(
      referralId,
      { $addToSet: { courseIds: courseId } },
      { new: true },
    );
  }

 async addReferredUser(
  referralCode: string,
  userId: string | Types.ObjectId,
  courseId: string | Types.ObjectId,
  status: string,
) {
  // Convert to ObjectId if needed
  const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
  const courseObjectId = typeof courseId === 'string' ? new Types.ObjectId(courseId) : courseId;

  console.log(referralCode, userObjectId, courseObjectId, status);

  return this.model.findOneAndUpdate(
    { code: referralCode }, // ✅ Use 'code' as defined in your schema
    {
      $addToSet: {
        referredUsers: {
          userId: userObjectId,
          courseId: courseObjectId,
          status,
        },
      },
    },
    { new: true, upsert: false }, // `new: true` returns the updated doc
  );
}

async getAll() {
  return this.model.find().populate('userId').populate('referredUsers.userId').populate('referredUsers.courseId');
}

async updateReferredUserStatus(
  referralCode: string,
  userId: string,
  courseId: string,
  status: 'pending' | 'completed',
) {
  return this.model.updateOne(
    {
      code: referralCode,
      referredUsers: {
        $elemMatch: {
          userId: new Types.ObjectId(userId),
          courseId: new Types.ObjectId(courseId),
        },
      },
    },
    {
      $set: {
        'referredUsers.$.status': status,
      },
    },
  );
}


}