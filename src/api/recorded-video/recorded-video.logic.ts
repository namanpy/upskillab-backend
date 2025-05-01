// import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { RecordedVideoDataService } from './recorded-video.data';
// import { CreateRecordedVideoDto, UpdateRecordedVideoDto, GetRecordedVideosResponseDTO, RecordedVideo } from '../../dto/recorded-video.dto';
// import { RecordedVideoDocument } from '../../schemas/recorded-video.schema';
// import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';
// import { USER_TYPES } from '../../common/constants/user.constants';
// import { VIDEO_STATUS } from '../../common/constants/recorded-video.constants';

// export interface IUser {
//   _id: any;
//   userId: string;
//   role: string;
//   userType: string;
// }

// @Injectable()
// export class RecordedVideoLogicService {
//   constructor(private recordedVideoDataService: RecordedVideoDataService) {}

//   private async mapToDto(video: RecordedVideoDocument): Promise<RecordedVideo> {
//     await video.populate('chapterId');
//     await video.populate('courseId');
//     await video.populate('uploadedBy');
//     return mapToDto<RecordedVideo, RecordedVideoDocument>(video);
//   }

//   private async mapToDtoArray(videos: RecordedVideoDocument[]): Promise<RecordedVideo[]> {
//     const populatedVideos: RecordedVideoDocument[] = []; // Initialize with correct type
//     for (const video of videos) {
//       await video.populate('chapterId');
//       await video.populate('courseId');
//       await video.populate('uploadedBy');
//       populatedVideos.push(video);
//     }
//     return populatedVideos.map(video => mapToDto<RecordedVideo, RecordedVideoDocument>(video));
//   }

//   async getVideos(user: IUser): Promise<GetRecordedVideosResponseDTO> {
//     let videos: RecordedVideoDocument[] = await this.recordedVideoDataService.getVideos();

//     if (user.userType === USER_TYPES.ADMIN) {
//       // Admin can see all videos
//     } else if (user.userType === USER_TYPES.TEACHER) {
//       videos = videos.filter(video => video.uploadedBy.toString() === user.userId);
//     } else if (user.userType === USER_TYPES.STUDENT) {
//       videos = videos.filter(video => video.status === VIDEO_STATUS.APPROVED && video.isPublic);
//     } else {
//       throw new UnauthorizedException('Access denied');
//     }

//     return { videos: await this.mapToDtoArray(videos) };
//   }

//   async createVideo(createRecordedVideoDto: CreateRecordedVideoDto, user: IUser) {
//     if (user.userType !== USER_TYPES.TEACHER && user.userType !== USER_TYPES.ADMIN) {
//       throw new UnauthorizedException('Only Teachers and Admins can create videos');
//     }

//     const video = await this.recordedVideoDataService.createVideo(createRecordedVideoDto, user.userId);
//     return { video: await this.mapToDto(video) };
//   }

//   async getVideoById(id: string, user: IUser) {
//     const video = await this.recordedVideoDataService.getVideoById(id);

//     if (!video) {
//       throw new NotFoundException(`Video with ID ${id} not found`);
//     }

//     if (user.userType === USER_TYPES.STUDENT) {
//       if (video.status !== VIDEO_STATUS.APPROVED || !video.isPublic) {
//         throw new UnauthorizedException('You can only view approved and public videos');
//       }
//     } else if (user.userType === USER_TYPES.TEACHER) {
//       if (video.uploadedBy.toString() !== user.userId && user.userType !== USER_TYPES.ADMIN) {
//         throw new UnauthorizedException('You can only view your own videos');
//       }
//     } else if (user.userType !== USER_TYPES.ADMIN) {
//       throw new UnauthorizedException('Access denied');
//     }

//     return { video: await this.mapToDto(video) };
//   }

//   async updateVideo(id: string, updateRecordedVideoDto: UpdateRecordedVideoDto, user: IUser) {
//     const video = await this.recordedVideoDataService.getVideoById(id);

//     if (!video) {
//       throw new NotFoundException(`Video with ID ${id} not found`);
//     }

//     if (user.userType === USER_TYPES.TEACHER) {
//       if (video.uploadedBy.toString() !== user.userId) {
//         throw new UnauthorizedException('You can only update your own videos');
//       }
//       if (updateRecordedVideoDto.status) {
//         throw new UnauthorizedException('Teachers cannot change video status');
//       }
//     } else if (user.userType !== USER_TYPES.ADMIN) {
//       throw new UnauthorizedException('Only Teachers and Admins can update videos');
//     }

//     const updatedVideo = await this.recordedVideoDataService.updateVideo(id, updateRecordedVideoDto);
//     if (!updatedVideo) {
//       throw new NotFoundException(`Failed to update video with ID ${id}`);
//     }

//     return { video: await this.mapToDto(updatedVideo) };
//   }

//   async deleteVideo(id: string, user: IUser) {
//     const video = await this.recordedVideoDataService.getVideoById(id);

//     if (!video) {
//       throw new NotFoundException(`Video with ID ${id} not found`);
//     }

//     if (user.userType === USER_TYPES.TEACHER) {
//       if (video.uploadedBy.toString() !== user.userId) {
//         throw new UnauthorizedException('You can only delete your own videos');
//       }
//     } else if (user.userType !== USER_TYPES.ADMIN) {
//       throw new UnauthorizedException('Only Teachers and Admins can delete videos');
//     }

//     const deletedVideo = await this.recordedVideoDataService.deleteVideo(id);
//     return { message: 'Video deleted successfully' };
//   }
// }

// import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { RecordedVideoDataService } from './recorded-video.data';
// import { CreateRecordedVideoDto, UpdateRecordedVideoDto, GetRecordedVideosResponseDTO, RecordedVideo } from '../../dto/recorded-video.dto';
// import { RecordedVideoDocument } from '../../schemas/recorded-video.schema';
// import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';
// import { USER_TYPES } from '../../common/constants/user.constants';
// import { VIDEO_STATUS } from '../../common/constants/recorded-video.constants';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RecordedVideoDataService } from './recorded-video.data';
import { CreateRecordedVideoDto, UpdateRecordedVideoDto, GetRecordedVideosResponseDTO, RecordedVideo } from '../../dto/recorded-video.dto';
import { RecordedVideoDocument } from '../../schemas/recorded-video.schema';
import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';
import { USER_TYPES } from '../../common/constants/user.constants';
import { VIDEO_STATUS } from '../../common/constants/recorded-video.constants';

export interface IUser {
  _id: any;
  userId: string;
  role: string;
  userType: string;
}

@Injectable()
export class RecordedVideoLogicService {
  constructor(private recordedVideoDataService: RecordedVideoDataService) {}

  private async mapToDto(video: RecordedVideoDocument): Promise<RecordedVideo> {
    await video.populate('chapterId');
    await video.populate('courseId');
    return mapToDto<RecordedVideo, RecordedVideoDocument>(video);
  }

  private async mapToDtoArray(videos: RecordedVideoDocument[]): Promise<RecordedVideo[]> {
    const populatedVideos: RecordedVideoDocument[] = [];
    for (const video of videos) {
      await video.populate('chapterId');
      await video.populate('courseId');
      populatedVideos.push(video);
    }
    return populatedVideos.map(video => mapToDto<RecordedVideo, RecordedVideoDocument>(video));
  }

  async getVideos(user: IUser): Promise<GetRecordedVideosResponseDTO> {
    let videos: RecordedVideoDocument[] = await this.recordedVideoDataService.getVideos();

    if (user.userType === USER_TYPES.ADMIN) {
      // Admin can see all videos
    } else if (user.userType === USER_TYPES.TEACHER) {
      videos = videos.filter(video => video.status === VIDEO_STATUS.APPROVED && video.isPublic); // Example filter, adjust as needed
    } else if (user.userType === USER_TYPES.STUDENT) {
      videos = videos.filter(video => video.status === VIDEO_STATUS.APPROVED && video.isPublic);
    } else {
      throw new UnauthorizedException('Access denied');
    }

    return { videos: await this.mapToDtoArray(videos) };
  }

  async createVideo(createRecordedVideoDto: CreateRecordedVideoDto, user: IUser) {
    if (user.userType !== USER_TYPES.TEACHER && user.userType !== USER_TYPES.ADMIN) {
      throw new UnauthorizedException('Only Teachers and Admins can create videos');
    }

    const video = await this.recordedVideoDataService.createVideo(createRecordedVideoDto);
    return { video: await this.mapToDto(video) };
  }

  async getVideoById(id: string, user: IUser) {
    const video = await this.recordedVideoDataService.getVideoById(id);

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    if (user.userType === USER_TYPES.STUDENT) {
      if (video.status !== VIDEO_STATUS.APPROVED || !video.isPublic) {
        throw new UnauthorizedException('You can only view approved and public videos');
      }
    } else if (user.userType === USER_TYPES.TEACHER && user.userType !== USER_TYPES.ADMIN) {
      // No uploadedBy check since field is removed
    } else if (user.userType !== USER_TYPES.ADMIN) {
      throw new UnauthorizedException('Access denied');
    }

    return { video: await this.mapToDto(video) };
  }

  async updateVideo(id: string, updateRecordedVideoDto: UpdateRecordedVideoDto, user: IUser) {
    const video = await this.recordedVideoDataService.getVideoById(id);

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    if (user.userType === USER_TYPES.TEACHER) {
      // No uploadedBy check
      if (updateRecordedVideoDto.status) {
        throw new UnauthorizedException('Teachers cannot change video status');
      }
    } else if (user.userType !== USER_TYPES.ADMIN) {
      throw new UnauthorizedException('Only Teachers and Admins can update videos');
    }

    const updatedVideo = await this.recordedVideoDataService.updateVideo(id, updateRecordedVideoDto);
    if (!updatedVideo) {
      throw new NotFoundException(`Failed to update video with ID ${id}`);
    }

    return { video: await this.mapToDto(updatedVideo) };
  }

  async deleteVideo(id: string, user: IUser) {
    const video = await this.recordedVideoDataService.getVideoById(id);

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    if (user.userType === USER_TYPES.TEACHER) {
      // No uploadedBy check
    } else if (user.userType !== USER_TYPES.ADMIN) {
      throw new UnauthorizedException('Only Teachers and Admins can delete videos');
    }

    const deletedVideo = await this.recordedVideoDataService.deleteVideo(id);
    return { message: 'Video deleted successfully' };
  }
}