import { Controller, Get } from '@nestjs/common';
import { TemplatePluginService } from './plugin.service.js';

@Controller('plugin/template')
export class TemplatePluginController {
    constructor(private readonly templatePlugin: TemplatePluginService) {}

    @Get()
    test() {
        return this.templatePlugin.test();
    }
}
