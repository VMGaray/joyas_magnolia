/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);

  const corsOriginEnv = configService.get<string>('CORS_ORIGIN') ?? '';
  const resolvedOrigins =
    corsOriginEnv === '*'
      ? '*'
      : corsOriginEnv
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

  app.enableCors({
    origin: resolvedOrigins === '*' ? true : resolvedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  logger.log(
    `CORS habilitado para: ${resolvedOrigins === '*' ? '*' : resolvedOrigins.join(', ')}`,
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Aidi')
    .setDescription('Api de servicios para Magnolia Joyas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
