import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Tensorplex Kami')
    .setDescription('API for Tensorplex Kami')
    .setVersion('1.0')
    .addTag('substrate')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(document));
  console.log(`Swagger JSON saved to ${outputPath}`);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.KAMI_PORT ?? 3000);
}

bootstrap();
