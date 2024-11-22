import { Inject, Injectable, Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export enum Environment {
    Development = 'development',
    Production = 'production',
}

export enum LogLevel {
    Debug = 'debug',
    Info = 'info',
}

const EnvironmentToLogLevelMap: Record<Environment, LogLevel> = {
    [Environment.Development]: LogLevel.Debug,
    [Environment.Production]: LogLevel.Info,
};

const coreEnvSchema = z.object({
    environment: z.nativeEnum(Environment),
    debug: z.preprocess(Boolean, z.boolean()),
    port: z.preprocess(Number, z.number()),
});

export const CoreConfig = registerAs('core', () => {
    const parsed = coreEnvSchema.parse({
        environment: process.env.NODE_ENV,
        debug: process.env.DEBUG,
        port: process.env.PORT,
    });

    return {
        environment: parsed.environment,
        debug: parsed.debug,
        logLevel: EnvironmentToLogLevelMap[parsed.environment],
        port: parsed.port,
    };
});

type CoreConfig = ReturnType<typeof CoreConfig>;

@Injectable()
export class CoreConfigService {
    private readonly logger = new Logger(CoreConfigService.name);

    constructor(
        @Inject(CoreConfig.KEY)
        private readonly config: CoreConfig,
    ) {
        this.logger.debug(`Core Config: ${JSON.stringify(this.config)}`);
    }

    get environment(): Environment {
        return this.config.environment;
    }

    get debug(): boolean {
        return this.config.debug;
    }

    get logLevel(): LogLevel {
        return this.config.logLevel;
    }

    get port(): number {
        return this.config.port;
    }
}
