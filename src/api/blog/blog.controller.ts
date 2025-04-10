// import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
// import { BlogLogicService } from './blog.logic';
// import { CreateBlogDto, GetBlogsResponseDTO } from '../../dto/blog.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ImageUploaderService } from '../../common/services/image-uploader.service';

// @ApiTags('blogs')
// @Controller('blogs')
// export class BlogController {
//   constructor(
//     private blogLogicService: BlogLogicService,
//     private imageUploaderService: ImageUploaderService,
//   ) {}

//   @ApiResponse({ status: 200, description: 'Get all approved blogs', type: GetBlogsResponseDTO })
//   @Get('')
//   async getBlogs(@Query('all') all?: string) {
//     const approvedOnly = all !== 'true';
//     return await this.blogLogicService.getBlogs(approvedOnly);
//   }

//   @ApiResponse({ status: 201, description: 'Create a new blog with image upload' })
//   @Post('')
//   @UseInterceptors(FileInterceptor('image'))
//   async createBlog(@Body() createBlogDto: CreateBlogDto, @UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException('Image file is required');
//     }

//     const image = await this.imageUploaderService.uploadImage(file, 'blogs', Date.now().toString());
//     const blogData = { ...createBlogDto, image };

//     return await this.blogLogicService.createBlog(blogData);
//   }

//   @ApiResponse({ status: 200, description: 'Get a single blog by ID' })
//   @Get(':id')
//   async getBlogById(@Param('id') id: string) {
//     return await this.blogLogicService.getBlogById(id);
//   }

//   @ApiResponse({ status: 200, description: 'Update a blog by ID' })
//   @Put(':id')
//   async updateBlog(@Param('id') id: string, @Body() updateBlogDto: Partial<CreateBlogDto>) {
//     return await this.blogLogicService.updateBlog(id, updateBlogDto);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a blog by ID' })
//   @Delete(':id')
//   async deleteBlog(@Param('id') id: string) {
//     return await this.blogLogicService.deleteBlog(id);
//   }

//   @ApiResponse({ status: 200, description: 'Approve or reject a blog by ID' })
//   @Put(':id/approve')
//   async approveBlog(@Param('id') id: string, @Body() { approved }: { approved: boolean }) {
//     if (approved === undefined) {
//       throw new BadRequestException('approved field is required');
//     }
//     return await this.blogLogicService.approveBlog(id, approved);
//   }
// }


import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
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

  @ApiResponse({ status: 200, description: 'Get all blogs', type: GetBlogsResponseDTO })
  @Get('')
  async getBlogs(): Promise<GetBlogsResponseDTO> {
    return await this.blogLogicService.getBlogs();
  }

  @ApiResponse({ status: 201, description: 'Create a new blog with image upload' })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
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

  @ApiResponse({ status: 200, description: 'Update a blog by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: Partial<CreateBlogDto>,
    @UploadedFile() file?: Express.Multer.File, // Image is optional
  ) {
    let blogData: Partial<CreateBlogDto & { image: string }> = { ...updateBlogDto };

    if (file) {
      const image = await this.imageUploaderService.uploadImage(file, 'blogs', `${id}-${Date.now()}`);
      blogData = { ...blogData, image };
    }

    return await this.blogLogicService.updateBlog(id, blogData);
  }

  @ApiResponse({ status: 200, description: 'Partially update a blog by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async patchBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: Partial<CreateBlogDto>,
    @UploadedFile() file?: Express.Multer.File, // Image is optional
  ) {
    let blogData: Partial<CreateBlogDto & { image: string }> = { ...updateBlogDto };

    if (file) {
      const image = await this.imageUploaderService.uploadImage(file, 'blogs', `${id}-${Date.now()}`);
      blogData = { ...blogData, image };
    }

    return await this.blogLogicService.updateBlog(id, blogData);
  }

  @ApiResponse({ status: 200, description: 'Delete a blog by ID' })
  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    return await this.blogLogicService.deleteBlog(id);
  }
}