import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from 'src/utils/exception-filter/http-exception.filter';
import { SuccessInterceptor } from 'src/utils/exception-filter/success.interceptor';
import { CamelCaseRequestPipe } from 'src/utils/pipe/camelcase-request.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new CamelCaseRequestPipe());
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
