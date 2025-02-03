import { Plugin } from '@/modules/pluginManager/types/plugin.js';
import packageJson from '../package.json' with { type: 'json' };
import { CoreModule } from './core.module.js';

export default {
    name: '@tradercore/framework',
    version: packageJson.version,
    module: CoreModule,
} satisfies Plugin;

export * from './core.module.js';
export * from './modules/pluginManager/types/plugin.js';
