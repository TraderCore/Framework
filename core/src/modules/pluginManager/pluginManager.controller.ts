import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ALLOWED_ENTRYPOINT_TYPES, PLUGINS, REGISTRIES } from './constants.js';
import { PluginResponseDto } from './dto/plugin.response.dto.js';
import { RegistryResponseDto } from './dto/registry.response.dto.js';
import { Plugin, PluginType } from './types/plugin.js';
import { Registry } from './types/registry.js';

@Controller('plugins')
export class PluginManagerController {
    constructor(
        @Inject(PLUGINS) private readonly plugins: Plugin[],
        @Inject(REGISTRIES) private readonly registries: Registry[],
        @Inject(ALLOWED_ENTRYPOINT_TYPES)
        private readonly allowedEntrypointTypes: PluginType[],
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get all plugins' })
    @ApiResponse({
        type: PluginResponseDto,
        isArray: true,
    })
    getPlugins() {
        return this.plugins;
    }

    @Get('types')
    @ApiOperation({ summary: 'Get all plugin types' })
    @ApiResponse({
        type: String,
        isArray: true,
    })
    getPluginTypes() {
        return this.allowedEntrypointTypes;
    }

    @Get('registries')
    @ApiOperation({ summary: 'Get all registries' })
    @ApiResponse({
        type: RegistryResponseDto,
        isArray: true,
    })
    getRegistries() {
        return this.registries;
    }
}
