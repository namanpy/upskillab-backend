import { Types } from 'mongoose';

export class MongooseDocument {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
