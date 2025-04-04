import { Types } from 'mongoose';

export type StringifyObjectId<T> = {
  [K in keyof T]: T[K] extends Types.ObjectId ? string | Types.ObjectId : T[K];
};
