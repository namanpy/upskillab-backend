import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog, BlogDocument } from '../../schemas/blog.schema';
import { CreateBlogDto } from '../../dto/blog.dto';

@Injectable()
export class BlogDataService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async getBlogs(
    approvedOnly: boolean = true,
    options: {
      studentId?: Types.ObjectId;
    } = {},
  ): Promise<BlogDocument[]> {
    const { studentId } = options;
    return this.blogModel
      .find(
        approvedOnly
          ? { approvedByAdmin: true, ...(studentId && { studentId }) }
          : { ...(studentId && { studentId }) },
      )
      .populate('studentId', 'fullName')
      .exec();
  }

  async createBlog(
    createBlogDto: CreateBlogDto & { image: string },
  ): Promise<BlogDocument> {
    const newBlog = new this.blogModel(createBlogDto);
    return newBlog.save();
  }

  async getBlogById(id: string): Promise<BlogDocument | null> {
    return this.blogModel.findById(id).populate('studentId', 'fullName').exec();
  }

  async updateBlog(
    id: string,
    updateBlogDto: Partial<CreateBlogDto & { image: string }>,
  ): Promise<BlogDocument | null> {
    return this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true })
      .populate('studentId', 'fullName')
      .exec();
  }

  async deleteBlog(id: string): Promise<BlogDocument | null> {
    return this.blogModel.findByIdAndDelete(id).exec();
  }

  async approveBlog(
    id: string,
    approved: boolean,
  ): Promise<BlogDocument | null> {
    const update = { approvedByAdmin: approved };
    if (approved) {
      update['approvedAt'] = new Date();
    } else {
      update['approvedAt'] = null;
    }
    return this.blogModel
      .findByIdAndUpdate(id, update, { new: true })
      .populate('studentId', 'fullName')
      .exec();
  }
}
