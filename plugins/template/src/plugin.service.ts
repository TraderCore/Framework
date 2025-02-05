import { Injectable, Logger } from '@nestjs/common';
import { CoreConfigService } from '@tradercore/framework/config';

@Injectable()
export class PluginService {
    private readonly logger = new Logger(PluginService.name);

    constructor(private readonly configService: CoreConfigService) {
        this.logger.log('PluginService constructor');
        this.logger.log(`Core config: ${this.configService.debug}`);
    }
}
