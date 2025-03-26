import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
  } from '@nestjs/common';
import { DemoSessionLogicService } from './demosession.logic';
import { CreateDemoSessionDto } from '../../dto/demosession.dto';
import { GetDemoSessionsResponseDTO } from '../../dto/demosession.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('demosessions')
@Controller('demosessions')
export class DemoSessionController {
  constructor(private demoSessionLogicService: DemoSessionLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all demo sessions',
    type: GetDemoSessionsResponseDTO,
  })
  @Get('')
  async getDemoSessions(): Promise<GetDemoSessionsResponseDTO> {
    return await this.demoSessionLogicService.getDemoSessions();
  }

  @ApiResponse({
    status: 201,
    description: 'Create a new demo session',
  })
  @Post('')
  async createDemoSession(@Body() createDemoSessionDto: CreateDemoSessionDto) {
    return await this.demoSessionLogicService.createDemoSession(createDemoSessionDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get a single demo session by ID',
  })
  @Get(':id')
  async getDemoSessionById(@Param('id') id: string) {
    return await this.demoSessionLogicService.getDemoSessionById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a demo session by ID',
  })
  @Put(':id')
  async updateDemoSession(
    @Param('id') id: string,
    @Body() updateDemoSessionDto: Partial<CreateDemoSessionDto>,
  ) {
    return await this.demoSessionLogicService.updateDemoSession(id, updateDemoSessionDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a demo session by ID',
  })
  @Delete(':id')
  async deleteDemoSession(@Param('id') id: string) {
    return await this.demoSessionLogicService.deleteDemoSession(id);
  }
}