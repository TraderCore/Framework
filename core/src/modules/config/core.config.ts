import { Inject, Injectable, Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';

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

class CoreConfigDto {
    @IsEnum(Environment)
    environment!: Environment;

    @IsBoolean()
    @Type(() => Boolean)
    debug!: boolean;

    @IsNumber()
    @Type(() => Number)
    port!: number;
}

export const CoreConfig = registerAs('core', () => {
    const config = new CoreConfigDto();
    config.environment =
        (process.env.NODE_ENV as Environment) || Environment.Development;
    config.debug = process.env.DEBUG === 'true';
    config.port = Number(process.env.PORT) || 8080;

    return {
        environment: config.environment,
        debug: config.debug,
        logLevel: EnvironmentToLogLevelMap[config.environment],
        port: config.port,
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
