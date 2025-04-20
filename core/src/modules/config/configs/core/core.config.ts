import { registerAs } from '@nestjs/config';
import { CoreConfigDto } from './dtos/core-config.dto.js';
import { EnvironmentToLogLevelMap } from './types/environment-log-level.map.js';
import { Environment } from './types/environment.enum.js';

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

export type CoreConfig = ReturnType<typeof CoreConfig>;
