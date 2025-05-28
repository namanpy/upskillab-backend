import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AssociationLogicService } from './associations.logic';
import { CreateAssociationDto, UpdateAssociationDto, AssociationResponse, GetAssociationsResponseDTO } from '../../../dto/associations.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guard/roles.guard';
import { USER_TYPES } from '../../../common/constants/user.constants';
import { User } from '../../../common/decorators/user.decorator';

@ApiTags('associations')
@Controller('associations')
export class AssociationController {
  constructor(private associationLogicService: AssociationLogicService) {}

  @ApiResponse({
    status: 201,
    description: 'Create a new association',
    type: AssociationResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.ADMIN)
  @Post()
  async createAssociation(
    @User() user: any,
    @Body() createAssociationDto: CreateAssociationDto,
  ): Promise<{ association: AssociationResponse }> {
    return await this.associationLogicService.createAssociation(createAssociationDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get all associations',
    type: GetAssociationsResponseDTO,
  })
  @ApiBearerAuth()
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Roles(USER_TYPES.STUDENT, USER_TYPES.TEACHER, USER_TYPES.ADMIN)
  @Get()
  async getAssociations(): Promise<GetAssociationsResponseDTO> {
    return await this.associationLogicService.getAssociations();
  }

  @ApiResponse({
    status: 200,
    description: 'Get an association by ID',
    type: AssociationResponse,
  })
  @ApiBearerAuth()
//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Roles(USER_TYPES.STUDENT, USER_TYPES.TEACHER, USER_TYPES.ADMIN)
  @Get(':id')
  async getAssociationById(@Param('id') id: string): Promise<{ association: AssociationResponse }> {
    return await this.associationLogicService.getAssociationById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update an association',
    type: AssociationResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.ADMIN)
  @Patch(':id')
  async updateAssociation(
    @Param('id') id: string,
    @Body() updateAssociationDto: UpdateAssociationDto,
  ): Promise<{ association: AssociationResponse }> {
    return await this.associationLogicService.updateAssociation(id, updateAssociationDto);
  }


  @ApiResponse({
    status: 200,
    description: 'Delete an association',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_TYPES.ADMIN)
  @Delete(':id')
  async deleteAssociation(@Param('id') id: string): Promise<void> {
    return await this.associationLogicService.deleteAssociation(id);
  }
}