import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/index.js';
import { PluginManagerModule } from './modules/pluginManager/pluginManager.module.js';

@Module({
    imports: [
        ConfigModule,
        PluginManagerModule.register({
            registriesString:
                process.env.REGISTRIES ?? 'registry.tradercore.dev',
            pluginsString: process.env.PLUGINS ?? '',
            allowedEntrypointTypesString:
                process.env.ALLOWED_ENTRYPOINT_TYPES ?? '',
        }),
    ],
    providers: [],
    exports: [],
})
export class CoreModule {}
