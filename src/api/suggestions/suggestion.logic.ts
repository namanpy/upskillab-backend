import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { SuggestionDataService } from './suggestion.data';
import { BatchDataService } from '../batch/batch.data';
import { OrderDataService } from '../order/order.data';
import { FileUploaderService } from '../../common/services/file-uploader.service';
import {
  CreateSuggestionDTO,
  UpdateSuggestionDTO,
  SuggestionDTO,
  GetSuggestionsResponseDTO,
} from '../../dto/suggestion.dto';
import { USER_TYPES } from '../../common/constants/user.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Teacher, TeacherDocument } from '../../schemas/teacher.schema';
import { NotificationLogicService } from '../notification/notification.logic';
@Injectable()
export class SuggestionLogicService {
  constructor(
    private suggestionDataService: SuggestionDataService,
    private batchDataService: BatchDataService,
    private orderDataService: OrderDataService,
    private fileUploaderService: FileUploaderService,
    private notificationLogicService: NotificationLogicService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  private async mapToDto(suggestion: any): Promise<SuggestionDTO> {
    const batch = suggestion.batchId;
    const teacher = suggestion.teacherId;
  const teacherdetals = await this.teacherModel.findOne({ user: teacher }).exec();
    return {
      _id: suggestion._id.toString(),
      title: suggestion.title,
      description: suggestion.description,
      type: suggestion.type,
      content: suggestion.content,
      batchId: suggestion?.batchId?._id.toString() || null,
      teacherId: suggestion.teacherId._id.toString(),
      teacherName: teacherdetals?.name || 'Unknown',
      isApproved: suggestion.isApproved,
      createdAt: suggestion.createdAt.toISOString(),
      updatedAt: suggestion.updatedAt.toISOString(),
    };
  }

  private async mapToDtoArray(suggestions: any[]): Promise<SuggestionDTO[]> {
    return Promise.all(suggestions.map((s) => this.mapToDto(s)));
  }

async createSuggestion(
  user: any,
  createSuggestionDto: CreateSuggestionDTO,
  file?: Express.Multer.File,
): Promise<SuggestionDTO> {
  if (user.userType !== USER_TYPES.TEACHER) {
    throw new ForbiddenException('Only teachers can create suggestions');
  }

  // Fetch teacher profile
  const teacher = await this.teacherModel.findOne({ user: user._id }).exec();
  if (!teacher) {
    throw new NotFoundException(
      'Teacher profile not found for this user. Please create a teacher profile.',
    );
  }

  let batch;
  if (createSuggestionDto.batchId) {
    // Validate batch if batchId is provided
    batch = await this.batchDataService.getBatchById(createSuggestionDto.batchId);
    if (!batch) {
      throw new BadRequestException(`Batch with ID ${createSuggestionDto.batchId} not found`);
    }

    const batchTeacherId = batch.teacher?._id?.toString() || batch.teacher?.toString();

    if (!batchTeacherId) {
      throw new BadRequestException(
        `Batch ${createSuggestionDto.batchId} has no assigned teacher`,
      );
    }

    if (batchTeacherId !== teacher._id.toString()) {
      throw new ForbiddenException(
        `You are not assigned to batch ${createSuggestionDto.batchId}. Assigned teacher ID: ${batchTeacherId}`,
      );
    }
  }

  let content = createSuggestionDto.content || '';
  const suggestionData: any = {
  ...createSuggestionDto,
  teacherId: user._id,
  content,
};

if (!createSuggestionDto.batchId) {
  delete suggestionData.batchId;
}

  const suggestion = await this.suggestionDataService.createSuggestion(suggestionData);

  await this.notificationLogicService.createNotification({
    message: `New Suggestions Created on ${suggestion.title}`,
    role: 'admin',
    type: 'suggestion',
  });

  return this.mapToDto(suggestion);
}


async getStudentSuggestions(user: any): Promise<GetSuggestionsResponseDTO> {

  if (user.userType !== USER_TYPES.STUDENT) {
    throw new ForbiddenException('Only students can access suggestions');
  }

  const orders = await this.orderDataService.getOrdersByUser(user._id);

  const batchIds = orders
    .map((order) => order?.batch?._id?.toString())
    .filter((id): id is string => typeof id === 'string');


  const suggestions = await this.suggestionDataService.getSuggestionsForStudent(batchIds);
  return {
    suggestions: await this.mapToDtoArray(suggestions),
  };
}


  async getTeacherSuggestions(user: any): Promise<GetSuggestionsResponseDTO> {
    if (user.userType !== USER_TYPES.TEACHER) {
      throw new ForbiddenException(
        'Only teachers can access their suggestions',
      );
    }

    const suggestions =
      await this.suggestionDataService.getSuggestionsByTeacher(user._id);
    return {
      suggestions: await this.mapToDtoArray(suggestions),
    };
  }

  async getAllSuggestions(user: any): Promise<GetSuggestionsResponseDTO> {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('Only admins can access all suggestions');
    }

    const suggestions = await this.suggestionDataService.getAllSuggestions();
    return {
      suggestions: await this.mapToDtoArray(suggestions),
    };
  }

  async approveSuggestion(
    id: string,
    user: any,
    isApproved: boolean,
  ): Promise<SuggestionDTO> {
    if (user.userType !== USER_TYPES.ADMIN) {
     
      throw new ForbiddenException('Only admins can approve suggestions');
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid suggestion ID');
    }

    const suggestion = await this.suggestionDataService.getSuggestionById(id);
    if (!suggestion) {
      throw new NotFoundException(`Suggestion with ID ${id} not found`);
    }

    const updatedSuggestion = await this.suggestionDataService.updateSuggestion(
      id,
      { isApproved },
    );
    if (!updatedSuggestion) {
      throw new NotFoundException(`Suggestion with ID ${id} not found`);
    }

    return this.mapToDto(updatedSuggestion);
  }

  async approveSuggestionTrue(id: string, user: any): Promise<SuggestionDTO> {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('Only admins can approve suggestions');
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid suggestion ID');
    }

    const suggestion = await this.suggestionDataService.getSuggestionById(id);
    if (!suggestion) {
      throw new NotFoundException(`Suggestion with ID ${id} not found`);
    }

    const updatedSuggestion = await this.suggestionDataService.updateSuggestion(
      id,
      { isApproved: true },
    );
    if (!updatedSuggestion) {
      throw new NotFoundException(`Suggestion with ID ${id} not found`);
    }
    await this.notificationLogicService.createNotification({
    message: `A ${updatedSuggestion.type} added in Trends`,
    role: 'student',
    type: updatedSuggestion.type,
  });

    return this.mapToDto(updatedSuggestion);
  }

  async deleteSuggestion(id: string, user: any): Promise<void> {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('Only admins can delete suggestions');
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid suggestion ID');
    }

    const suggestion = await this.suggestionDataService.getSuggestionById(id);
    if (!suggestion) {
      throw new NotFoundException(`Suggestion with ID ${id} not found`);
    }

    await this.suggestionDataService.deleteSuggestion(id);

  }
}
