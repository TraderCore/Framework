import { Inject, Injectable, Logger } from '@nestjs/common';
import { VERSION } from '@tradercore/core';
import { CoreConfigService } from '@tradercore/core/config';

@Injectable()
export class TemplatePluginService {
    private readonly logger = new Logger(TemplatePluginService.name);

    constructor(private readonly config: CoreConfigService) {
        this.logger.log(
            `TemplatePluginService constructor @ ${new Date().toISOString()}`,
        );
        // Can't use Core as it is ESM and this is CJS for the VM
        this.logger.log(`Core version: ${VERSION}`);

        this.logger.log(`Config: ${JSON.stringify(this.config, null, 2)}`);
    }

    test() {
        this.logger.log('Test');
        return 'Test';
    }
}
