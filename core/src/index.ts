import { Plugin } from '@/modules/pluginManager/types/plugin';
const packageJson = require('../package.json');
import { CoreModule } from './core.module';

export default {
    name: '@tradercore/framework',
    version: packageJson.version,
    module: CoreModule,
} satisfies Plugin;

export * from './core.module';
export * from './modules/pluginManager/types/plugin';
export * from './modules/pluginManager/pluginManager.module';
