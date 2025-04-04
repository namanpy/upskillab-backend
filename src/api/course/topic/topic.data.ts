import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from '../../../schemas/course/topic.schema';
import { StringifyObjectId } from 'src/common/types/common.types';

@Injectable()
export class TopicDataService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}

  async getTopics(chapterId: string) {
    return this.topicModel
      .find({ chapter: chapterId })
      .sort({ topicNumber: 1 })
      .lean()
      .exec();
  }

  async createTopic(input: Omit<Topic, '_id'>) {
    const newTopic = new this.topicModel(input);
    return newTopic.save();
  }

  async getTopicById(id: string) {
    return this.topicModel.findById(id).exec();
  }

  async updateTopic(
    id: string,
    updateTopicDto: Partial<StringifyObjectId<Topic>>,
  ) {
    return this.topicModel
      .findByIdAndUpdate(id, updateTopicDto, { new: true })
      .exec();
  }

  async deleteTopic(id: string): Promise<TopicDocument | null> {
    return this.topicModel.findByIdAndDelete(id).exec();
  }
}
