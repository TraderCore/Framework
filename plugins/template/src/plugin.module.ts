import { Global, Module } from '@nestjs/common';
import { TemplatePluginService } from './plugin.service.js';

@Global()
@Module({
    imports: [],
    providers: [TemplatePluginService],
    exports: [TemplatePluginService],
})
export class TemplatePluginModule {}
