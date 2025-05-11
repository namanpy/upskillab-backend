import { Types } from 'mongoose';

type BaseDocument = {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
};

type BaseDto = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
};

export const mapToDto = <T extends BaseDto, D extends BaseDocument>(
  document: D,
  additionalMapping: (doc: D) => Partial<T> = () => ({}),
): T => {
  const baseDto: BaseDto = {
    _id: document._id.toString(),
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };

  const additionalFields = additionalMapping(document);

  return {
    ...baseDto,
    ...document.  toObject(),
    ...additionalFields,
    _id: document._id.toString(),
  } as T;
};

export const mapToDtoArray = <T extends BaseDto, D extends BaseDocument>(
  documents: D[],
  additionalMapping: (doc: D) => Partial<T> = () => ({}),
): T[] => {
  return documents.map((doc) => mapToDto<T, D>(doc, additionalMapping));
};
