import { Global, Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from './modules/config/index.js';
import { PluginManagerModule } from './modules/pluginManager/pluginManager.module.js';

@Global()
@Module({
    imports: [PluginManagerModule.forRoot({ registry: [] }), ConfigModule],
    providers: [],
    exports: [ConfigModule],
})
export class CoreModule {}
