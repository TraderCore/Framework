import { Global, Module } from '@nestjs/common';
import { CoreModule } from '@tradercore/core';
import { TemplatePluginController } from './plugin.controller.js';
import { TemplatePluginService } from './plugin.service.js';

@Global()
@Module({
    imports: [],
    controllers: [TemplatePluginController],
    providers: [TemplatePluginService],
    exports: [TemplatePluginService],
})
export class TemplatePluginModule {}
