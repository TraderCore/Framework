import { Inject, Injectable, Logger } from '@nestjs/common';
import { CoreConfig } from './core.config.js';
import { Environment } from './types/environment.enum.js';
import { LogLevel } from './types/log-level.enum.js';

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
