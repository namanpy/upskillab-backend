import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateStudyMaterialDto,
  UpdateStudyMaterialDto,
} from 'src/dto/update-study.dto';
import {
  StudyMaterial,
  StudyMaterialDocument,
} from 'src/schemas/study_materials.schema';

@Injectable()
export class StudyMaterialDataService {
  constructor(
    @InjectModel(StudyMaterial.name)
    private readonly studyMaterialModel: Model<StudyMaterialDocument>,
  ) {}

  // Create a new study material
  async createStudyMaterial(
    createStudyMaterialDto: CreateStudyMaterialDto,
  ) {
    const createdStudyMaterial = new this.studyMaterialModel(
      createStudyMaterialDto,
    );
    return createdStudyMaterial.save();
  }

  // Get all study materials
  async getAllStudyMaterials() {
    return this.studyMaterialModel
      .find()
      .populate('course')
      .populate('chapter')
      .populate('teacher')
      .exec();
  }

  // Get a study material by ID
  async getStudyMaterialById(id: string) {
    return this.studyMaterialModel
      .findById(id)
      .populate('course')
      .populate('chapter')
      .populate('teacher')
      .exec();
  }

  // Get study materials by course ID
  async getStudyMaterialsByCourseId(courseId: string) {
    return this.studyMaterialModel
      .find({ course: courseId })
      .populate('course')
      .populate('chapter')
      .populate('teacher')
      .exec();
  }

  // ✅ Get study materials by teacher ID
  async getStudyMaterialsByTeacherId(teacherId: string) {
    return this.studyMaterialModel
      .find({ teacher: teacherId }) // filter by teacher ID
      .populate('course')
      .populate('chapter')
      .populate('teacher')
      .exec();
  }

  // Update a study material
  async updateStudyMaterial(
    id: string,
    updateStudyMaterialDto: UpdateStudyMaterialDto,
  ) {
    return this.studyMaterialModel
      .findByIdAndUpdate(id, updateStudyMaterialDto, { new: true })
      .exec();
  }

  // Delete a study material
  async deleteStudyMaterial(id: string) {
    return this.studyMaterialModel.findByIdAndDelete(id).exec();
  }
}
