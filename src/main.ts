import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from 'src/utils/exception-filter/http-exception.filter';
import { SuccessInterceptor } from 'src/utils/exception-filter/success.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { SnakeToCamelPipe } from 'src/utils/pipe/snake-to-came.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(
    new SnakeToCamelPipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
