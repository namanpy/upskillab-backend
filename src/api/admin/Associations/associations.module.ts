import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Association, AssociationSchema } from '../../../schemas/associations.schema';
import { AssociationController } from './associations.controller';
import { AssociationLogicService } from './associations.logic';
import { AssociationDataService } from './associations.data';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Association.name, schema: AssociationSchema }]),
  ],
  controllers: [AssociationController],
  providers: [AssociationLogicService, AssociationDataService],
})
export class AssociationModule {}