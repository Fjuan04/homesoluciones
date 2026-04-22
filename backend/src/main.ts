import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors(); // Permite acceso desde Astro u otros dominios
  app.setGlobalPrefix('api'); // Todos los endpoints web tendrán /api/ al inicio
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
