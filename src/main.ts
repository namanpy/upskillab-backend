import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/classes/exception-filter.class';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Error Setup
  app.useGlobalFilters(new GlobalExceptionFilter());
  // CORS enabled
  app.enableCors();
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set file size limit for uploads
  // app.useBodyParser('json', { limit: '10mb' });
  // app.useBodyParser('urlencoded', { limit: '10mb', extended: true });
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Upskillab.com Backend')
    .setDescription('The backend APIs for Upskillab')
    .setVersion('1.0')
    .addTag('upskillab.com')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
