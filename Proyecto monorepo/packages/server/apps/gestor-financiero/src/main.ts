import { NestFactory } from '@nestjs/core';
import { GestorFinancieroModule } from './gestor-financiero.module';

async function bootstrap() {
  const app = await NestFactory.create(GestorFinancieroModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
