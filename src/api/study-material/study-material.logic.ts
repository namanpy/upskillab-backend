import { Injectable, NotFoundException } from '@nestjs/common';
import { StudyMaterialDataService } from './study-material.data';
import { CreateStudyMaterialDto, UpdateStudyMaterialDto } from 'src/dto/update-study.dto';

@Injectable()
export class StudyMaterialLogicService {
  constructor(private readonly studyMaterialDataService: StudyMaterialDataService) {}

  // Create a new study material
  async createStudyMaterial(createStudyMaterialDto: CreateStudyMaterialDto) {
    const studyMaterial = await this.studyMaterialDataService.createStudyMaterial(createStudyMaterialDto);
    return { studyMaterial };
  }

  // Get all study materials
  async getAllStudyMaterials() {
    const studyMaterials = await this.studyMaterialDataService.getAllStudyMaterials();
    return { studyMaterials };
  }

  // Get a single study material by ID
  async getStudyMaterialById(id: string) {
    const studyMaterial = await this.studyMaterialDataService.getStudyMaterialById(id);
    if (!studyMaterial) {
      throw new NotFoundException(`Study Material with ID ${id} not found`);
    }
    return { studyMaterial };
  }

  // Get study materials by course ID
  async getStudyMaterialsByCourseId(courseId: string) {
    const studyMaterials = await this.studyMaterialDataService.getStudyMaterialsByCourseId(courseId);
    console.log(studyMaterials,'hi')
    if (!studyMaterials || studyMaterials.length === 0) {
      // throw new NotFoundException(`No study materials found for course ID ${courseId}`);
      return {studyMaterials};
    }
    return { studyMaterials };
  }

  // ✅ Get study materials by teacher ID
  async getStudyMaterialsByTeacherId(teacherId: string) {
    const studyMaterials = await this.studyMaterialDataService.getStudyMaterialsByTeacherId(teacherId);
    if (!studyMaterials || studyMaterials.length === 0) {
      // throw new NotFoundException(`No study materials found for teacher ID ${teacherId}`);
      return {studyMaterials};
    }
    return { studyMaterials };
  }

  // Update an existing study material
  async updateStudyMaterial(id: string, updateStudyMaterialDto: UpdateStudyMaterialDto) {
    const updatedStudyMaterial = await this.studyMaterialDataService.updateStudyMaterial(id, updateStudyMaterialDto);
    if (!updatedStudyMaterial) {
      throw new NotFoundException(`Study Material with ID ${id} not found`);
    }
    return { updatedStudyMaterial };
  }

  // Delete a study material
  async deleteStudyMaterial(id: string) {
    const deletedStudyMaterial = await this.studyMaterialDataService.deleteStudyMaterial(id);
    if (!deletedStudyMaterial) {
      throw new NotFoundException(`Study Material with ID ${id} not found`);
    }
    return { message: 'Study Material deleted successfully' };
  }
}
