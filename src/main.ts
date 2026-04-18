import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validate incoming requests bodies automatically globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that don't have decorators
      forbidNonWhitelisted: true,
      transform: true, // automatically transformers payloads to be objects typed according to their dto classes
      disableErrorMessages: false,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
