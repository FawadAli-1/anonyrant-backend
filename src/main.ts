import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Add global prefix
  app.setGlobalPrefix('api');

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

  // Try ports 3000, 3002, 3003 until one works
  const ports = [3000, 3002, 3003];
  for (const port of ports) {
    try {
      await app.listen(port);
      console.log(`Server running on port ${port}`);
      break;
    } catch (error) {
      if (error.code !== 'EADDRINUSE') throw error;
      console.log(`Port ${port} is in use, trying next port...`);
      if (port === ports[ports.length - 1]) {
        throw new Error('No available ports found');
      }
    }
  }
}
bootstrap();
