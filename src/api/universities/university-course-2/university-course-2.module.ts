// import { Module } from '@nestjs/common';
// import { UniversityCourse2Controller } from './university-course-2.controller';
// import { UniversityCourse2LogicService } from './university-course-2.logic';
// import { UniversityCourse2DataService } from './university-course-2.data';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UniversityCourse2, UniversityCourse2Schema } from '../../../schemas/universities/university-course-2.schema';
// import { ImageUploaderService } from '../../../common/services/image-uploader.service';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: UniversityCourse2.name, schema: UniversityCourse2Schema }]),
//   ],
//   providers: [UniversityCourse2DataService, UniversityCourse2LogicService, ImageUploaderService],
//   controllers: [UniversityCourse2Controller],
//   exports: [UniversityCourse2DataService],
// })
// export class UniversityCourse2Module {}


import { Module } from '@nestjs/common';
import { UniversityCourse2Controller } from './university-course-2.controller';
import { UniversityCourse2LogicService } from './university-course-2.logic';
import { UniversityCourse2DataService } from './university-course-2.data';
import { MongooseModule } from '@nestjs/mongoose';
import { UniversityCourse2, UniversityCourse2Schema } from '../../../schemas/universities/university-course-2.schema';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';
import { University2DataService } from '../university2/university2.data';
import { University2, University2Schema } from '../../../schemas/universities/university2.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UniversityCourse2.name, schema: UniversityCourse2Schema },
      { name: University2.name, schema: University2Schema },
    ]),
  ],
  providers: [
    UniversityCourse2DataService,
    UniversityCourse2LogicService,
    University2DataService,
    ImageUploaderService,
  ],
  controllers: [UniversityCourse2Controller],
  exports: [UniversityCourse2DataService],
})
export class UniversityCourse2Module {}