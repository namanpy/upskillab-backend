import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogDataService } from './blog.data';
import { CreateBlogDto, GetBlogsResponseDTO, Blog } from '../../dto/blog.dto';
import { BlogDocument } from '../../schemas/blog.schema';
import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';
import { Types } from 'mongoose';

// Define PopulatedStudent interface based on the Student schema
interface PopulatedStudent {
  _id: Types.ObjectId;
  fullName: string;
  college?: string;
  studentType: string;
  // Add other fields if populated, e.g., user if needed
}

@Injectable()
export class BlogLogicService {
  constructor(private blogDataService: BlogDataService) {}

  private mapToDto(blog: BlogDocument): Blog {
    const docObject = blog.toObject();
    const student = docObject.studentId as PopulatedStudent | Types.ObjectId; // Handle both populated and unpopulated cases
    return mapToDto<Blog, BlogDocument>(blog, (doc) => ({
      ...docObject,
      _id: doc._id.toHexString(), // Convert ObjectId to string
      studentId: doc.studentId instanceof Types.ObjectId ? doc.studentId.toHexString() : (doc.studentId as PopulatedStudent)._id.toHexString(), // Convert to string
      studentName: student instanceof Types.ObjectId ? undefined : (student as PopulatedStudent).fullName, // Safely extract fullName
    }));
  }

  private mapToDtoArray(blogs: BlogDocument[]): Blog[] {
    return mapToDtoArray<Blog, BlogDocument>(blogs, (doc) => {
      const docObject = doc.toObject();
      const student = docObject.studentId as PopulatedStudent | Types.ObjectId;
      return {
        ...docObject,
        _id: doc._id.toHexString(), // Convert ObjectId to string
        studentId: doc.studentId instanceof Types.ObjectId ? doc.studentId.toHexString() : (doc.studentId as PopulatedStudent)._id.toHexString(), // Convert to string
        studentName: student instanceof Types.ObjectId ? undefined : (student as PopulatedStudent).fullName, // Safely extract fullName
      };
    });
  }

  async getBlogs(approvedOnly: boolean = true): Promise<GetBlogsResponseDTO> {
    const blogs = await this.blogDataService.getBlogs(approvedOnly);
    return {
      blogs: this.mapToDtoArray(blogs),
    };
  }

  async createBlog(createBlogDto: CreateBlogDto & { image: string }) {
    const blog = await this.blogDataService.createBlog(createBlogDto);
    return {
      blog: this.mapToDto(blog),
    };
  }

  async getBlogById(id: string): Promise<{ blog: Blog }> {
    const blog = await this.blogDataService.getBlogById(id);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return {
      blog: this.mapToDto(blog),
    };
  }

  async updateBlog(id: string, updateBlogDto: Partial<CreateBlogDto & { image: string }>) {
    const blog = await this.blogDataService.updateBlog(id, updateBlogDto);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return {
      blog: this.mapToDto(blog),
    };
  }

  async deleteBlog(id: string) {
    const blog = await this.blogDataService.deleteBlog(id);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return { message: 'Blog deleted successfully' };
  }

  async approveBlog(id: string, approved: boolean) {
    const blog = await this.blogDataService.approveBlog(id, approved);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return {
      blog: this.mapToDto(blog),
    };
  }
}