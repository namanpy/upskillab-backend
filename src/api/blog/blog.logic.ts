import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogDataService } from './blog.data';
import { CreateBlogDto, GetBlogsResponseDTO, Blog } from '../../dto/blog.dto';
import { BlogDocument } from '../../schemas/blog.schema';
import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';
import { Types } from 'mongoose';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { USER_TYPES } from 'src/common/constants/user.constants';

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
    let studentIdValue: string | undefined;
    let studentName: string | undefined;

    // Handle different cases for studentId
    if (docObject.studentId === undefined || docObject.studentId === null) {
      studentIdValue = undefined; // Allow undefined for optional studentId
      studentName = undefined;
    } else if (docObject.studentId instanceof Types.ObjectId) {
      studentIdValue = docObject.studentId.toHexString(); // Convert ObjectId to string
      studentName = undefined; // Not populated yet
    } else if (typeof docObject.studentId === 'string') {
      studentIdValue = docObject.studentId; // Use the string ID from DTO
      studentName = undefined; // Not populated yet
    } else {
      // Handle populated student case
      const student = docObject.studentId as PopulatedStudent;
      studentIdValue = student._id.toHexString(); // Convert populated _id to string
      studentName = student.fullName;
    }

    return mapToDto<Blog, BlogDocument>(blog, (doc) => ({
      ...docObject,
      _id: doc._id.toHexString(), // Convert ObjectId to string
      studentId: studentIdValue, // Assign the determined studentId (can be undefined)
      studentName, // Assign the determined studentName
    }));
  }

  private mapToDtoArray(blogs: BlogDocument[]): Blog[] {
    return mapToDtoArray<Blog, BlogDocument>(blogs, (doc) => {
      const docObject = doc.toObject();
      let studentIdValue: string | undefined;
      let studentName: string | undefined;

      // Handle different cases for studentId
      if (docObject.studentId === undefined || docObject.studentId === null) {
        studentIdValue = undefined; // Allow undefined for optional studentId
        studentName = undefined;
      } else if (docObject.studentId instanceof Types.ObjectId) {
        studentIdValue = docObject.studentId.toHexString(); // Convert ObjectId to string
        studentName = undefined; // Not populated yet
      } else if (typeof docObject.studentId === 'string') {
        studentIdValue = docObject.studentId; // Use the string ID from DTO
        studentName = undefined; // Not populated yet
      } else {
        // Handle populated student case
        const student = docObject.studentId as PopulatedStudent;
        studentIdValue = student._id.toHexString(); // Convert populated _id to string
        studentName = student.fullName;
      }

      return {
        ...docObject,
        _id: doc._id.toHexString(), // Convert ObjectId to string
        studentId: studentIdValue, // Assign the determined studentId (can be undefined)
        studentName, // Assign the determined studentName
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

  async updateBlog(
    id: string,
    updateBlogDto: Partial<CreateBlogDto & { image: string; userType: string }>,
  ) {
    const existingBlog = await this.blogDataService.getBlogById(id);

    if (
      updateBlogDto.userType === USER_TYPES.STUDENT &&
      !existingBlog?.studentId.equals(updateBlogDto.studentId)
    )
      throw new CustomError(ERROR.UNAUTHORIZED);

    const blog = await this.blogDataService.updateBlog(id, {
      ...updateBlogDto,
      ...(updateBlogDto.userType === USER_TYPES.STUDENT && {
        approvedByAdmin: false,
      }),
    });

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
