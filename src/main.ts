import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Tensorplex Kami')
    .setDescription(
      `Ultra-light server library written in TypeScript for interacting with the Bittensor chain.\n\nExample code samples provided work with the Kami boilerplate Python code in the repo [here](https://github.com/tensorplex-labs/kami/tree/main/docs/python-examples).\n\nYou may also test out the endpoints through [Swagger UI](http://localhost:${process.env.KAMI_PORT}/chain/docs) once the Kami instance is running locally.`,
    )
    .setVersion('1.0')
    .addServer(`http://localhost:${process.env.KAMI_PORT}`, 'Development')
    .setContact('Tensorplex Labs', 'https://tensorplex.ai', '')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);

  const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(document));
  console.log(`Swagger JSON saved to ${outputPath}`);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.KAMI_PORT ?? 3000);
}

bootstrap();
