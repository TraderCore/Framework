import { Global, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';

export const CoreConfig = registerAs('core', () => ({
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.DEBUG === 'true',
}));

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

    getEnvironment(): string {
        return this.config.environment;
    }

    getDebug(): boolean {
        return this.config.debug;
    }
}
