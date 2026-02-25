import type { Plugin } from '@tradercore/framework';
import packageJson from '../package.json';
import { migrations } from './migrations';
import { TestModule } from './test.module';

export default {
    name: packageJson.name,
    version: packageJson.version,
    module: TestModule,
    migrations,
} satisfies Plugin;
