import { Controller, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PLUGINS } from './constants.js';
import { PluginResponseDto } from './dto/plugin.response.dto.js';
import { Plugin } from './types/plugin.js';

@Controller('plugins')
export class PluginManagerController {
    constructor(@Inject(PLUGINS) private readonly plugins: Plugin[]) {}

    @Get()
    @ApiOperation({ summary: 'Get all plugins' })
    @ApiResponse({
        type: PluginResponseDto,
        isArray: true,
    })
    getPlugins() {
        return this.plugins;
    }
}
