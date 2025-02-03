import 'reflect-metadata';
import { config } from 'dotenv';

import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import path from 'node:path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './modules/app.module.js';

const processEnvPath = (file: string) =>
    path.resolve(process.cwd(), '..', '..', file);

config({
    path: ['.env', '.env.local'].map(processEnvPath),
});

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
        abortOnError: true,

        rawBody: true,
    });
    app.useLogger(app.get(Logger));

    const swaggerConfig = new DocumentBuilder()
        .setTitle('TraderCore API')
        .setDescription('API for TraderCore')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);

    app.enableShutdownHooks();
    app.enableCors();
    app.enableVersioning();

    const logger = app.get(Logger);

    app.use(helmet());
    app.use(compression());

    const port = process.env.PORT || 8080;

    await app.startAllMicroservices().then(() => {
        app.listen(port).then(() => {
            logger.log(`Server is running on port ${port} 🚀`);
        });
    });
};

bootstrap();
