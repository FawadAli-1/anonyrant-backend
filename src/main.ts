import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false // Disable default CORS to configure it manually
  });

  // Configure CORS
  app.enableCors({
    origin: [
      'https://anonyrant.vercel.app',     // Production frontend
      'http://localhost:3000',            // Local development frontend
      'http://localhost:3001',            // Alternative local port
      /\.vercel\.app$/                    // All Vercel preview deployments
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    exposedHeaders: [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers'
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Add global prefix
  app.setGlobalPrefix('api');

  // Add global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Add global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      transform: true, // Transform payloads to be objects typed according to their DTO classes
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
      transformOptions: {
        enableImplicitConversion: true, // Automatically transform query parameters to their correct types
      },
    }),
  );

  // Use port from environment variable or fallback to 3000
  const port = process.env.PORT || 3000;
  
  // Listen on all network interfaces
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}
bootstrap();
