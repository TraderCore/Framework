import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoreConfigService } from '@tradercore/core/config';

@Injectable()
export class DevService {
    private readonly logger = new Logger(DevService.name);

    constructor(private readonly config: CoreConfigService) {}

    test() {
        this.logger.log('Setting up dev environment');
        return `test ${this.config.port}`;
    }
}
