import { type Plugin, PluginType } from '@tradercore/core';
import { TemplatePluginModule } from './plugin.module.js';

export default {
    name: '@tradercore/plugin-template',
    version: '0.0.0',
    entrypoints: [
        {
            type: PluginType.Api,
            description: 'API entrypoint',
            module: TemplatePluginModule,
        },
    ],
} satisfies Plugin;
