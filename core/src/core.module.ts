import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/index.js';
import { PluginManagerModule } from './modules/pluginManager/pluginManager.module.js';

@Module({
    imports: [ConfigModule, PluginManagerModule.forRoot({ registry: [] })],
    providers: [],
    exports: [],
})
export class CoreModule {}
