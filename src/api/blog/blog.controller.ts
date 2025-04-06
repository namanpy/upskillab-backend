import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
import { BlogLogicService } from './blog.logic';
import { CreateBlogDto, GetBlogsResponseDTO } from '../../dto/blog.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../common/services/image-uploader.service';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(
    private blogLogicService: BlogLogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all approved blogs', type: GetBlogsResponseDTO })
  @Get('')
  async getBlogs(@Query('all') all?: string) {
    const approvedOnly = all !== 'true'; // Show all if ?all=true, otherwise only approved
    return await this.blogLogicService.getBlogs(approvedOnly);
  }

  @ApiResponse({ status: 201, description: 'Create a new blog with image upload' })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createBlog(@Body() createBlogDto: CreateBlogDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const image = await this.imageUploaderService.uploadImage(file, 'blogs', Date.now().toString());
    const blogData = { ...createBlogDto, image };

    return await this.blogLogicService.createBlog(blogData);
  }

  @ApiResponse({ status: 200, description: 'Get a single blog by ID' })
  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return await this.blogLogicService.getBlogById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a blog by ID' })
  @Put(':id')
  async updateBlog(@Param('id') id: string, @Body() updateBlogDto: Partial<CreateBlogDto>) {
    return await this.blogLogicService.updateBlog(id, updateBlogDto);
  }

  @ApiResponse({ status: 200, description: 'Delete a blog by ID' })
  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    return await this.blogLogicService.deleteBlog(id);
  }

  @ApiResponse({ status: 200, description: 'Approve or reject a blog by ID' })
  @Put(':id/approve')
  async approveBlog(@Param('id') id: string, @Body('approved') approved: boolean) {
    return await this.blogLogicService.approveBlog(id, approved);
  }
}