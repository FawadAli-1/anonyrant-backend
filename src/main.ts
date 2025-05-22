import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

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

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://anonyrant.vercel.app"
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  try {
    const port = process.env.PORT || 5000
    await app.listen(port)
    console.log(`Listening on port ${port}`);

  } catch (error) {
    console.log(error);

  }

}
bootstrap();
