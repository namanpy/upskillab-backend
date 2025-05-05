import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId,IsOptional} from 'class-validator';
export class CreateStudyMaterialDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileLink: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  course: string;  // ObjectId of the course

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  chapter: string;  // ObjectId of the chapter

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  teacher: string;
}

export class UpdateStudyMaterialDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    title?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    fileLink?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsMongoId()
    course?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsMongoId()
    chapter?: string;

    @ApiProperty({ required: false })
    teacher?: string;
  }