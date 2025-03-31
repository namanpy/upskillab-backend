import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from '../../../schemas/course/topic.schema';

@Injectable()
export class TopicDataService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}

  async getTopics(courseId: string): Promise<TopicDocument[]> {
    return this.topicModel.find({ courseId }).sort({ order: 1 }).exec();
  }

  async createTopic(input: Omit<Topic, '_id'>): Promise<TopicDocument> {
    const newTopic = new this.topicModel(input);
    return newTopic.save();
  }

  async getTopicById(id: string): Promise<TopicDocument | null> {
    return this.topicModel.findById(id).exec();
  }

  async updateTopic(
    id: string,
    updateTopicDto: Partial<Topic>,
  ): Promise<TopicDocument | null> {
    return this.topicModel
      .findByIdAndUpdate(id, updateTopicDto, { new: true })
      .exec();
  }

  async deleteTopic(id: string): Promise<TopicDocument | null> {
    return this.topicModel.findByIdAndDelete(id).exec();
  }
}
