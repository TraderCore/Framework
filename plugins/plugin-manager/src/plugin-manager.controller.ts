import { Controller, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { PLUGINS } from './constants.js';
import { Plugin } from './types.js';
@Controller('plugins')
export class PluginManagerController {
    constructor(@Inject(PLUGINS) private readonly plugins: Plugin[]) {}

    @Get()
    getPlugins() {
        return this.plugins;
    }
}
