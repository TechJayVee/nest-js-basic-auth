import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  //first way of doing reflector to enable defendency injection second is on the app module
  // const reflector = new Reflector();
  // app.useGlobalGuards(new JwtGuard(reflector));
  await app.listen(7777);
}
bootstrap();
