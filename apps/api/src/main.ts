/**
 * Punto de entrada de la API de Proxi (NestJS 10).
 *
 * Configura validación global, CORS, prefijo global y documentación
 * OpenAPI/Swagger.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Prefijo global para todos los endpoints de la API.
  app.setGlobalPrefix('api');

  // Validación global con class-validator: transforma y rechaza propiedades extra.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS configurable por variable de entorno (lista separada por comas).
  const corsOrigins = (config.get<string>('CORS_ORIGINS') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  });

  // Documentación OpenAPI / Swagger en /api/docs.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Proxi API')
    .setDescription(
      'API de Proxi: marketplace de servicios por tarea que conecta clientes con proveedores independientes verificados.',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('PORT') ?? 4000;
  await app.listen(port);
  logger.log(`🚀 API de Proxi escuchando en http://localhost:${port}/api`);
  logger.log(`📚 Documentación Swagger en http://localhost:${port}/api/docs`);
}

void bootstrap();
