import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './modules/app.module.js';

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
        abortOnError: true,
        rawBody: true,
    });
    app.useLogger(app.get(Logger));

    app.enableShutdownHooks();
    app.enableCors();
    app.enableVersioning();

    const logger = app.get(Logger);

    app.use(helmet());
    app.use(compression());

    const PORT = process.env.PORT || 8080;

    logger.log(`Server is running on port ${PORT} 🚀`);

    await app.listen(PORT);
};

bootstrap();
