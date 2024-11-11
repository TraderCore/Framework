import { Inject, Injectable, Logger } from '@nestjs/common';
import { VERSION } from '@tradercore/core';

@Injectable()
export class TemplatePluginService {
    private readonly logger = new Logger(TemplatePluginService.name);

    constructor() {
        this.logger.log(
            `TemplatePluginService constructor @ ${new Date().toISOString()}`,
        );
        // Can't use Core as it is ESM and this is CJS for the VM
        // this.logger.log(`Core version: ${VERSION}`);
    }
}
