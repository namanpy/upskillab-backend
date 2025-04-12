import { Types } from 'mongoose';

export type BaseDocument = {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
};

export type BaseDto = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
};

export const mapToDto = <T extends BaseDto, D extends BaseDocument>(
  document: D,
  additionalMapping: (doc: D) => Partial<T> = () => ({}),
): T => {
  // Safely handle both Mongoose documents and plain objects
  const docData = document instanceof Object && typeof document.toObject === 'function' ? document.toObject() : document;

  if (!docData || typeof docData !== 'object') {
    throw new Error('Invalid document provided to mapToDto');
  }

  const baseDto: BaseDto = {
    _id: docData._id.toString(),
    createdAt: docData.createdAt,
    updatedAt: docData.updatedAt,
  };

  const additionalFields = additionalMapping(docData);

  return {
    ...baseDto,
    ...docData,
    ...additionalFields,
    _id: docData._id.toString(),
  } as T;
};

export const mapToDtoArray = <T extends BaseDto, D extends BaseDocument>(
  documents: D[],
  additionalMapping: (doc: D) => Partial<T> = () => ({}),
): T[] => {
  return documents.map((doc) => mapToDto<T, D>(doc, additionalMapping));
};