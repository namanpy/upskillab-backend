import { Module } from '@nestjs/common';
import { StudyMaterialController } from './study-material.controller';
import { StudyMaterialLogicService } from './study-material.logic';
import { StudyMaterialDataService } from './study-material.data';
import { MongooseModule } from '@nestjs/mongoose';
import { StudyMaterial,StudyMaterialSchema } from 'src/schemas/study_materials.schema';
import { JwtModule } from '@nestjs/jwt'; // Import the JwtModule if needed for JWT generation
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudyMaterial.name, schema: StudyMaterialSchema }]),
    JwtModule,  // Include JwtModule if you're using JWT for authentication
    NotificationModule,
  ],
  controllers: [StudyMaterialController],
  providers: [StudyMaterialLogicService, StudyMaterialDataService],
})
export class StudyMaterialModule {}
