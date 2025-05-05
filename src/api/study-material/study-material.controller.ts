import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StudyMaterialLogicService } from './study-material.logic';
import {
  CreateStudyMaterialDto,
  UpdateStudyMaterialDto,
} from 'src/dto/update-study.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('study-materials')
@Controller('study-materials')
@UseGuards(AuthGuard('jwt')) // All routes are protected with Bearer Auth
export class StudyMaterialController {
  constructor(
    private readonly studyMaterialLogicService: StudyMaterialLogicService,
  ) {}

  // Create a new study material
  @Post()
  async create(@Body() createStudyMaterialDto: CreateStudyMaterialDto) {
    return this.studyMaterialLogicService.createStudyMaterial(
      createStudyMaterialDto,
    );
  }

  // Get all study materials
  @Get()
  async findAll() {
    return this.studyMaterialLogicService.getAllStudyMaterials();
  }

  // Get a single study material by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studyMaterialLogicService.getStudyMaterialById(id);
  }

  // Get study materials by course ID
  @Get('course/:courseId')
  async findByCourseId(@Param('courseId') courseId: string) {
    return this.studyMaterialLogicService.getStudyMaterialsByCourseId(
      courseId,
    );
  }

  // ✅ Get study materials by teacher ID
  @Get('teacher/:teacherId')
  async findByTeacherId(@Param('teacherId') teacherId: string) {
    return this.studyMaterialLogicService.getStudyMaterialsByTeacherId(
      teacherId,
    );
  }

  // Update a study material
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudyMaterialDto: UpdateStudyMaterialDto,
  ) {
    return this.studyMaterialLogicService.updateStudyMaterial(
      id,
      updateStudyMaterialDto,
    );
  }

  // Delete a study material
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studyMaterialLogicService.deleteStudyMaterial(id);
  }
}
