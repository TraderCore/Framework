import { Plugin } from '@tradercore/framework';
import packageJson from '../package.json';
import { PluginModule } from './plugin.module';

export default {
    name: '@tradercore/plugin-template',
    version: packageJson.version,
    module: PluginModule,
} satisfies Plugin;
