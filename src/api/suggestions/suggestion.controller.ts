// import { Controller, Post, Get, Patch, Body, UseGuards, UseInterceptors, UploadedFile, Param, Query } from '@nestjs/common';
// import { SuggestionLogicService } from './suggestion.logic';
// import { CreateSuggestionDTO, SuggestionDTO, GetSuggestionsResponseDTO } from '../../dto/suggestion.dto';
// import { ApiBearerAuth, ApiResponse, ApiTags, ApiConsumes, ApiQuery } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';
// import { User } from '../../common/decorators/user.decorator';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { USER_TYPES } from '../../common/constants/user.constants';
// import { Roles } from '../../common/decorators/roles.decorator';
// import { RolesGuard } from '../../common/guard/roles.guard';

// @ApiTags('suggestions')
// @Controller('suggestions')
// export class SuggestionController {
//   constructor(private suggestionLogicService: SuggestionLogicService) {}

//   @ApiResponse({
//     status: 201,
//     description: 'Create a new suggestion',
//     type: SuggestionDTO,
//   })
//   @ApiBearerAuth()
//   @ApiConsumes('multipart/form-data')
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Roles(USER_TYPES.TEACHER)
//   @UseInterceptors(FileInterceptor('file'))
//   @Post('')
//   async createSuggestion(
//     @User() user: any,
//     @Body() createSuggestionDto: CreateSuggestionDTO,
//     @UploadedFile() file?: Express.Multer.File,
//   ): Promise<SuggestionDTO> {
//     return await this.suggestionLogicService.createSuggestion(user, createSuggestionDto, file);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Get suggestions for enrolled courses (students)',
//     type: GetSuggestionsResponseDTO,
//   })
//   @ApiBearerAuth()
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Roles(USER_TYPES.STUDENT)
//   @Get('')
//   async getStudentSuggestions(@User() user: any): Promise<GetSuggestionsResponseDTO> {
//     return await this.suggestionLogicService.getStudentSuggestions(user);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Get teacher’s own suggestions',
//     type: GetSuggestionsResponseDTO,
//   })
//   @ApiBearerAuth()
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Roles(USER_TYPES.TEACHER)
//   @Get('teacher')
//   async getTeacherSuggestions(@User() user: any): Promise<GetSuggestionsResponseDTO> {
//     return await this.suggestionLogicService.getTeacherSuggestions(user);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Get all suggestions (admin)',
//     type: GetSuggestionsResponseDTO,
//   })
//   @ApiBearerAuth()
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Roles(USER_TYPES.ADMIN)
//   @Get('admin')
//   async getAllSuggestions(@User() user: any): Promise<GetSuggestionsResponseDTO> {
//     return await this.suggestionLogicService.getAllSuggestions(user);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Approve or reject a suggestion (admin)',
//     type: SuggestionDTO,
//   })
//   @ApiBearerAuth()
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Roles(USER_TYPES.ADMIN)
//   @ApiQuery({ name: 'isApproved', type: Boolean, required: true })
//   @Patch(':id/approve')
//   async approveSuggestion(
//     @Param('id') id: string,
//     @User() user: any,
//     @Query('isApproved') isApproved: boolean,
//   ): Promise<SuggestionDTO> {
//     return await this.suggestionLogicService.approveSuggestion(id, user, isApproved);
//   }
// }


import { Controller, Post, Get, Patch, Delete, Body, UseGuards, UseInterceptors, UploadedFile, Param, Query } from '@nestjs/common';
import { SuggestionLogicService } from './suggestion.logic';
import { CreateSuggestionDTO, SuggestionDTO, GetSuggestionsResponseDTO } from '../../dto/suggestion.dto';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { USER_TYPES } from '../../common/constants/user.constants';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guard/roles.guard';

@ApiTags('suggestions')
@Controller('suggestions')
export class SuggestionController {
  constructor(private suggestionLogicService: SuggestionLogicService) {}

  @ApiResponse({
    status: 201,
    description: 'Create a new suggestion',
    type: SuggestionDTO,
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.TEACHER)
  @UseInterceptors(FileInterceptor('file'))
  @Post('')
  async createSuggestion(
    @User() user: any,
    @Body() createSuggestionDto: CreateSuggestionDTO,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<SuggestionDTO> {
    return await this.suggestionLogicService.createSuggestion(user, createSuggestionDto, file);
  }

  @ApiResponse({
    status: 200,
    description: 'Get suggestions for enrolled courses (students)',
    type: GetSuggestionsResponseDTO,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.STUDENT)
  @Get('')
  async getStudentSuggestions(@User() user: any): Promise<GetSuggestionsResponseDTO> {
    return await this.suggestionLogicService.getStudentSuggestions(user);
  }
  

  @ApiResponse({
    status: 200,
    description: 'Get teacher’s own suggestions',
    type: GetSuggestionsResponseDTO,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.TEACHER)
  @Get('teacher')
  async getTeacherSuggestions(@User() user: any): Promise<GetSuggestionsResponseDTO> {
    return await this.suggestionLogicService.getTeacherSuggestions(user);
  }

  @ApiResponse({
    status: 200,
    description: 'Get all suggestions (admin)',
    type: GetSuggestionsResponseDTO,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.ADMIN)
  @Get('admin')
  async getAllSuggestions(@User() user: any): Promise<GetSuggestionsResponseDTO> {
    return await this.suggestionLogicService.getAllSuggestions(user);
  }

  @ApiResponse({
    status: 200,
    description: 'Approve or reject a suggestion (admin)',
    type: SuggestionDTO,
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles(USER_TYPES.ADMIN)
  // @ApiQuery({ name: 'isApproved', type: Boolean, required: true })
  // @Patch(':id/approve')
  // async approveSuggestion(
  //   @Param('id') id: string,
  //   @User() user: any,
  //   @Query('isApproved') isApproved: boolean,
  // ): Promise<SuggestionDTO> {
  //   return await this.suggestionLogicService.approveSuggestion(id, user, isApproved);
  // }

  @ApiResponse({
    status: 200,
    description: 'Approve a suggestion (set isApproved to true) (admin)',
    type: SuggestionDTO,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.ADMIN)
  @Patch(':id/approve-true')
  async approveSuggestionTrue(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<SuggestionDTO> {
    return await this.suggestionLogicService.approveSuggestionTrue(id, user);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a suggestion (admin)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.ADMIN)
  @Delete(':id')
  async deleteSuggestion(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<void> {
    return await this.suggestionLogicService.deleteSuggestion(id, user);
  }
}