// import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
// import { SuggestionDataService } from './suggestion.data';
// import { BatchDataService } from '../batch/batch.data';
// import { OrderDataService } from '../order/order.data';
// import { FileUploaderService } from '../../common/services/file-uploader.service';
// import { CreateSuggestionDTO, UpdateSuggestionDTO, SuggestionDTO, GetSuggestionsResponseDTO } from '../../dto/suggestion.dto';
// // import { SUGGESTION_TYPE } from '../../schemas/suggestion.schema';
// import { USER_TYPES } from '../../common/constants/user.constants';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User, UserDocument } from '../../schemas/user.schema';
// import { Teacher, TeacherDocument } from '../../schemas/teacher.schema';

// @Injectable()
// export class SuggestionLogicService {
//   constructor(
//     private suggestionDataService: SuggestionDataService,
//     private batchDataService: BatchDataService,
//     private orderDataService: OrderDataService,
//     private fileUploaderService: FileUploaderService,
//     @InjectModel(User.name) private userModel: Model<UserDocument>,
//     @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
//   ) {}

//   private async mapToDto(suggestion: any): Promise<SuggestionDTO> {
//     const batch = suggestion.batchId;
//     const teacher = suggestion.teacherId;
//     return {
//       _id: suggestion._id.toString(),
//       title: suggestion.title,
//       description: suggestion.description,
//       type: suggestion.type,
//       content: suggestion.content,
//       batchId: suggestion.batchId._id.toString(),
//       teacherId: suggestion.teacherId._id.toString(),
//       teacherName: teacher?.username || teacher?.name || 'Unknown',
//       isApproved: suggestion.isApproved,
//       createdAt: suggestion.createdAt.toISOString(),
//       updatedAt: suggestion.updatedAt.toISOString(),
//     };
//   }

//   private async mapToDtoArray(suggestions: any[]): Promise<SuggestionDTO[]> {
//     return Promise.all(suggestions.map(s => this.mapToDto(s)));
//   }

//   async createSuggestion(user: any, createSuggestionDto: CreateSuggestionDTO, file?: Express.Multer.File): Promise<SuggestionDTO> {
//     console.log('createSuggestion: User:', JSON.stringify(user, null, 2));
//     if (user.userType !== USER_TYPES.TEACHER) {
//       console.log('createSuggestion: Forbidden - User is not a teacher:', user.userType);
//       throw new ForbiddenException('Only teachers can create suggestions');
//     }

//     const batch = await this.batchDataService.getBatchById(createSuggestionDto.batchId);
//     if (!batch) {
//       console.log('createSuggestion: Batch not found:', createSuggestionDto.batchId);
//       throw new BadRequestException(`Batch with ID ${createSuggestionDto.batchId} not found`);
//     }

//     // Fetch Teacher document for the user
//     const teacher = await this.teacherModel.findOne({ user: user._id }).exec();
//     if (!teacher) {
//       console.log('createSuggestion: Teacher not found for user ID:', user._id);
//       throw new NotFoundException('Teacher profile not found for this user. Please create a teacher profile.');
//     }

//     // Handle populated or non-populated batch.teacher
//     const batchTeacherId = batch.teacher?._id ? batch.teacher._id.toString() : batch.teacher?.toString();
//     console.log('createSuggestion: Batch ID:', createSuggestionDto.batchId, 'Batch teacher ID:', batchTeacherId || 'unset', 'Teacher ID:', teacher._id.toString());

//     if (!batchTeacherId) {
//       console.log('createSuggestion: Batch has no assigned teacher:', createSuggestionDto.batchId);
//       throw new BadRequestException(`Batch ${createSuggestionDto.batchId} has no assigned teacher`);
//     }

//     if (batchTeacherId !== teacher._id.toString()) {
//       console.log('createSuggestion: Forbidden - User not assigned to batch. Batch ID:', createSuggestionDto.batchId, 'Batch teacher ID:', batchTeacherId, 'Teacher ID:', teacher._id.toString());
//       throw new ForbiddenException(`You are not assigned to batch ${createSuggestionDto.batchId}. Assigned teacher ID: ${batchTeacherId}`);
//     }

//     // if (createSuggestionDto.type === SUGGESTION_TYPE.PDF && !file) {
//     //   console.log('createSuggestion: PDF file missing');
//     //   throw new BadRequestException('PDF file is required for PDF type suggestion');
//     // }

//     // if (createSuggestionDto.type === SUGGESTION_TYPE.POST && !createSuggestionDto.content) {
//     //   console.log('createSuggestion: Content URL missing');
//     //   throw new BadRequestException('Content URL is required for POST type suggestion');
//     // }

//     let content = createSuggestionDto.content || '';
//     // if (createSuggestionDto.type === SUGGESTION_TYPE.PDF && file) {
//     //   console.log('createSuggestion: Uploading PDF file');
//     //   const uploadedFiles = await this.fileUploaderService.uploadFiles([file], 'suggestion', user._id);
//     //   if (!uploadedFiles || uploadedFiles.length === 0) {
//     //     console.log('createSuggestion: File upload failed');
//     //     throw new BadRequestException('Failed to upload PDF file');
//     //   }
//     //   content = uploadedFiles[0]?.fileUrl || '';
//     //   console.log('createSuggestion: PDF uploaded, URL:', content);
//     // }

//     const suggestionData = {
//       ...createSuggestionDto,
//       teacherId: user._id,
//       content,
//     };

//     const suggestion = await this.suggestionDataService.createSuggestion(suggestionData);
//     return this.mapToDto(suggestion);
//   }

//   async getStudentSuggestions(user: any): Promise<GetSuggestionsResponseDTO> {
//     console.log('getStudentSuggestions: User:', JSON.stringify(user, null, 2));
//     if (user.userType !== USER_TYPES.STUDENT) {
//       console.log('getStudentSuggestions: Forbidden - User is not a student:', user.userType);
//       throw new ForbiddenException('Only students can access suggestions');
//     }

//     const orders = await this.orderDataService.getOrdersByUser(user._id);
//     const batchIds = orders.map(order => order.batch.toString());
//     const suggestions = await this.suggestionDataService.getSuggestionsByBatch(batchIds, true);
//     return {
//       suggestions: await this.mapToDtoArray(suggestions),
//     };
//   }

//   async getTeacherSuggestions(user: any): Promise<GetSuggestionsResponseDTO> {
//     console.log('getTeacherSuggestions: User:', JSON.stringify(user, null, 2));
//     if (user.userType !== USER_TYPES.TEACHER) {
//       console.log('getTeacherSuggestions: Forbidden - User is not a teacher:', user.userType);
//       throw new ForbiddenException('Only teachers can access their suggestions');
//     }

//     const suggestions = await this.suggestionDataService.getSuggestionsByTeacher(user._id);
//     return {
//       suggestions: await this.mapToDtoArray(suggestions),
//     };
//   }

//   async getAllSuggestions(user: any): Promise<GetSuggestionsResponseDTO> {
//     console.log('getAllSuggestions: User:', JSON.stringify(user, null, 2));
//     if (user.userType !== USER_TYPES.ADMIN) {
//       console.log('getAllSuggestions: Forbidden - User is not an admin:', user.userType);
//       throw new ForbiddenException('Only admins can access all suggestions');
//     }

//     const suggestions = await this.suggestionDataService.getAllSuggestions();
//     return {
//       suggestions: await this.mapToDtoArray(suggestions),
//     };
//   }

//   async approveSuggestion(id: string, user: any, isApproved: boolean): Promise<SuggestionDTO> {
//     console.log('approveSuggestion: User:', JSON.stringify(user, null, 2));
//     if (user.userType !== USER_TYPES.ADMIN) {
//       console.log('approveSuggestion: Forbidden - User is not an admin:', user.userType);
//       throw new ForbiddenException('Only admins can approve suggestions');
//     }

//     const suggestion = await this.suggestionDataService.getSuggestionById(id);
//     if (!suggestion) {
//       console.log('approveSuggestion: Suggestion not found:', id);
//       throw new NotFoundException(`Suggestion with ID ${id} not found`);
//     }

//     const updatedSuggestion = await this.suggestionDataService.updateSuggestion(id, { isApproved });
//     if (!updatedSuggestion) {
//       console.log('approveSuggestion: Failed to update suggestion:', id);
//       throw new NotFoundException(`Suggestion with ID ${id} not found`);
//     }

//     return this.mapToDto(updatedSuggestion);
//   }
// }

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
    return {
      _id: suggestion._id.toString(),
      title: suggestion.title,
      description: suggestion.description,
      type: suggestion.type,
      content: suggestion.content,
      batchId: suggestion.batchId._id.toString(),
      teacherId: suggestion.teacherId._id.toString(),
      teacherName: teacher?.username || teacher?.name || 'Unknown',
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
    console.log('createSuggestion: User:', JSON.stringify(user, null, 2));
    if (user.userType !== USER_TYPES.TEACHER) {
      console.log(
        'createSuggestion: Forbidden - User is not a teacher:',
        user.userType,
      );
      throw new ForbiddenException('Only teachers can create suggestions');
    }

    const batch = await this.batchDataService.getBatchById(
      createSuggestionDto.batchId,
    );
    if (!batch) {
      console.log(
        'createSuggestion: Batch not found:',
        createSuggestionDto.batchId,
      );
      throw new BadRequestException(
        `Batch with ID ${createSuggestionDto.batchId} not found`,
      );
    }

    const teacher = await this.teacherModel.findOne({ user: user._id }).exec();
    if (!teacher) {
      console.log('createSuggestion: Teacher not found for user ID:', user._id);
      throw new NotFoundException(
        'Teacher profile not found for this user. Please create a teacher profile.',
      );
    }

    const batchTeacherId = batch.teacher?._id
      ? batch.teacher._id.toString()
      : batch.teacher?.toString();
    console.log(
      'createSuggestion: Batch ID:',
      createSuggestionDto.batchId,
      'Batch teacher ID:',
      batchTeacherId || 'unset',
      'Teacher ID:',
      teacher._id.toString(),
    );

    if (!batchTeacherId) {
      console.log(
        'createSuggestion: Batch has no assigned teacher:',
        createSuggestionDto.batchId,
      );
      throw new BadRequestException(
        `Batch ${createSuggestionDto.batchId} has no assigned teacher`,
      );
    }

    if (batchTeacherId !== teacher._id.toString()) {
      console.log(
        'createSuggestion: Forbidden - User not assigned to batch. Batch ID:',
        createSuggestionDto.batchId,
        'Batch teacher ID:',
        batchTeacherId,
        'Teacher ID:',
        teacher._id.toString(),
      );
      throw new ForbiddenException(
        `You are not assigned to batch ${createSuggestionDto.batchId}. Assigned teacher ID: ${batchTeacherId}`,
      );
    }

    let content = createSuggestionDto.content || '';
    const suggestionData = {
      ...createSuggestionDto,
      teacherId: user._id,
      content,
    };

    const suggestion =
      await this.suggestionDataService.createSuggestion(suggestionData);
    
    await this.notificationLogicService.createNotification({
      message: `New Suggestions Created on ${suggestion.title}`,
      role: 'admin',
      type: 'suggestion'
    });
    return this.mapToDto(suggestion);
  }

  async getStudentSuggestions(user: any): Promise<GetSuggestionsResponseDTO> {
    console.log('getStudentSuggestions: User:', JSON.stringify(user, null, 2));
    if (user.userType !== USER_TYPES.STUDENT) {
      console.log(
        'getStudentSuggestions: Forbidden - User is not a student:',
        user.userType,
      );
      throw new ForbiddenException('Only students can access suggestions');
    }

    const orders = await this.orderDataService.getOrdersByUser(user._id);
    const batchIds = orders.map((order) => order.batch._id.toString());
    console.log(batchIds);
    const suggestions = await this.suggestionDataService.getSuggestionsByBatch(
      batchIds,
      true,
    );




    return {
      suggestions: await this.mapToDtoArray(suggestions),
    };
  }

  async getTeacherSuggestions(user: any): Promise<GetSuggestionsResponseDTO> {
    console.log('getTeacherSuggestions: User:', JSON.stringify(user, null, 2));
    if (user.userType !== USER_TYPES.TEACHER) {
      console.log(
        'getTeacherSuggestions: Forbidden - User is not a teacher:',
        user.userType,
      );
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
    console.log('getAllSuggestions: User:', JSON.stringify(user, null, 2));
    if (user.userType !== USER_TYPES.ADMIN) {
      console.log(
        'getAllSuggestions: Forbidden - User is not an admin:',
        user.userType,
      );
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
    console.log('approveSuggestion: User:', JSON.stringify(user, null, 2));
    if (user.userType !== USER_TYPES.ADMIN) {
      console.log(
        'approveSuggestion: Forbidden - User is not an admin:',
        user.userType,
      );
      throw new ForbiddenException('Only admins can approve suggestions');
    }

    if (!Types.ObjectId.isValid(id)) {
      console.log('approveSuggestion: Invalid suggestion ID:', id);
      throw new BadRequestException('Invalid suggestion ID');
    }

    const suggestion = await this.suggestionDataService.getSuggestionById(id);
    if (!suggestion) {
      console.log('approveSuggestion: Suggestion not found:', id);
      throw new NotFoundException(`Suggestion with ID ${id} not found`);
    }

    const updatedSuggestion = await this.suggestionDataService.updateSuggestion(
      id,
      { isApproved },
    );
    if (!updatedSuggestion) {
      console.log('approveSuggestion: Failed to update suggestion:', id);
      throw new NotFoundException(`Suggestion with ID ${id} not found`);
    }

    return this.mapToDto(updatedSuggestion);
  }

  async approveSuggestionTrue(id: string, user: any): Promise<SuggestionDTO> {
    console.log('approveSuggestionTrue: User:', JSON.stringify(user, null, 2));
    if (user.userType !== USER_TYPES.ADMIN) {
      console.log(
        'approveSuggestionTrue: Forbidden - User is not an admin:',
        user.userType,
      );
      throw new ForbiddenException('Only admins can approve suggestions');
    }

    if (!Types.ObjectId.isValid(id)) {
      console.log('approveSuggestionTrue: Invalid suggestion ID:', id);
      throw new BadRequestException('Invalid suggestion ID');
    }

    const suggestion = await this.suggestionDataService.getSuggestionById(id);
    if (!suggestion) {
      console.log('approveSuggestionTrue: Suggestion not found:', id);
      throw new NotFoundException(`Suggestion with ID ${id} not found`);
    }

    const updatedSuggestion = await this.suggestionDataService.updateSuggestion(
      id,
      { isApproved: true },
    );
    if (!updatedSuggestion) {
      console.log('approveSuggestionTrue: Failed to update suggestion:', id);
      throw new NotFoundException(`Suggestion with ID ${id} not found`);
    }

    return this.mapToDto(updatedSuggestion);
  }

  async deleteSuggestion(id: string, user: any): Promise<void> {
    console.log('deleteSuggestion: User:', JSON.stringify(user, null, 2));
    if (user.userType !== USER_TYPES.ADMIN) {
      console.log(
        'deleteSuggestion: Forbidden - User is not an admin:',
        user.userType,
      );
      throw new ForbiddenException('Only admins can delete suggestions');
    }

    if (!Types.ObjectId.isValid(id)) {
      console.log('deleteSuggestion: Invalid suggestion ID:', id);
      throw new BadRequestException('Invalid suggestion ID');
    }

    const suggestion = await this.suggestionDataService.getSuggestionById(id);
    if (!suggestion) {
      console.log('deleteSuggestion: Suggestion not found:', id);
      throw new NotFoundException(`Suggestion with ID ${id} not found`);
    }

    await this.suggestionDataService.deleteSuggestion(id);
    console.log('deleteSuggestion: Suggestion deleted:', id);

  }
}
