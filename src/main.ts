import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
  logger.log(`Auth-ms running on port ${process.env.PORT ?? 3001} 🚀`);
}
bootstrap();
