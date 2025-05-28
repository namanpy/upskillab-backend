import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import { ResourceLogicService } from './resource.logic';
import {
  CreateResourceDto,
  UpdateResourceDto,
  GetResourcesResponseDTO,
} from '../../dto/resource.dto';
import {
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
// import { AuthGuard('jwt') } from '../../common/guard/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { USER_TYPES } from '../../common/constants/user.constants';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { User } from '../../common/decorators/user.decorator';

@ApiTags('resources')
@Controller('resources')
export class ResourceController {
  constructor(private resourceLogicService: ResourceLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all resources',
    type: GetResourcesResponseDTO,
  })
  @Get('')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.TEACHER, USER_TYPES.ADMIN, USER_TYPES.STUDENT)
  async getResources(@Request() req): Promise<GetResourcesResponseDTO> {
    return await this.resourceLogicService.getResources(req.user);
  }

  @ApiResponse({ status: 201, description: 'Create a new resource' })
  @Post('')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.TEACHER, USER_TYPES.ADMIN)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pdf', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @ApiBody({
    description: 'Create a new resource with optional PDF or image upload',
    type: CreateResourceDto,
  })
  async createResource(
    @Body() createResourceDto: CreateResourceDto,
    @User() user: any,
    @UploadedFiles()
    files: { pdf?: Express.Multer.File[]; image?: Express.Multer.File[] },
  ) {
    return await this.resourceLogicService.createResource(
      createResourceDto,
      user,
      files.pdf?.[0],
      files.image?.[0],
    );
  }

  @ApiResponse({ status: 200, description: 'Get a single resource by ID' })
  @Get(':id')
  async getResourceById(@Param('id') id: string) {
    return await this.resourceLogicService.getResourceById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a resource by ID' })
  @ApiBody({
    type: UpdateResourceDto,
    required: false,
    description: 'Partial update of resource',
  })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.TEACHER, USER_TYPES.ADMIN)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pdf', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  async updateResource(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @User() user: any,
    @UploadedFiles()
    files: { pdf?: Express.Multer.File[]; image?: Express.Multer.File[] },
  ) {
    return await this.resourceLogicService.updateResource(
      id,
      updateResourceDto,
      user,
      files.pdf?.[0],
      files.image?.[0],
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Partially update a resource by ID',
  })
  @ApiBody({
    type: UpdateResourceDto,
    required: false,
    description: 'Partial update of resource',
  })
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.TEACHER, USER_TYPES.ADMIN)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pdf', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  async patchResource(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @User() user: any,
    @UploadedFiles()
    files: { pdf?: Express.Multer.File[]; image?: Express.Multer.File[] },
  ) {
    console.log(updateResourceDto)
    return await this.resourceLogicService.updateResource(
      id,
      updateResourceDto,
      user,
      files.pdf?.[0],
      files.image?.[0],
    );
  }

  @ApiResponse({ status: 200, description: 'Delete a resource by ID' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.TEACHER, USER_TYPES.ADMIN)
  @ApiBearerAuth()
  async deleteResource(@Param('id') id: string, @User() user: any) {
    return await this.resourceLogicService.deleteResource(id, user);
  }
}
