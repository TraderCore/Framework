import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DevService {
    private readonly logger = new Logger(DevService.name);

    constructor() {
        this.logger.log('Dev Service');
    }
}
