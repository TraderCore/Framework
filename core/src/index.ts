import type { Plugin } from '@/modules/pluginManager/types/plugin';

const packageJson = require('../package.json');

import { CoreModule } from './core.module';

export default {
    name: '@tradercore/framework',
    version: packageJson.version,
    module: CoreModule,
} satisfies Plugin;

export * from './common/index';
export * from './core.module';
export * from './modules/database/index';
export * from './modules/pluginManager/pluginManager.module';
export * from './modules/pluginManager/types/plugin';
