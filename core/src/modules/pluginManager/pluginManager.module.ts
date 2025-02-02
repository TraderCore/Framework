import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { PLUGINS, REGISTRIES } from './constants.js';
import { loadPlugin } from './loaders/loadPlugin.js';
import { PluginManagerController } from './pluginManager.controller.js';
import type { Plugin, PluginInternal } from './types/plugin.js';

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
        const toLoad: string[] = [
            'file://../../../../../plugins/template/dist/index.js',
        ];

        const registries: string[] = [
            'registry.tradercore.dev/v1',
            ...options.registry,
        ];

        const plugins: Plugin[] = [];

        const logger = new Logger(PluginManagerModule.name);

        for (const pluginUri of toLoad) {
            const loaded = await loadPlugin(pluginUri).catch((error) => {
                logger.error(`Failed to load plugin ${pluginUri}: ${error}`);
                return null;
            });

            if (loaded) {
                logger.log(
                    `Loaded plugin ${loaded.name}@${loaded.version} from ${pluginUri}`,
                );

                const internal: PluginInternal = {
                    ...loaded,
                    location: pluginUri,
                };

                plugins.push(internal);
            }
        }

        logger.log(`Loaded ${plugins.length} plugins`);

        return {
            module: PluginManagerModule,
            imports: plugins.flatMap((plugin) =>
                plugin.entrypoints.map(
                    (entrypoint) => entrypoint.module as DynamicModule,
                ),
            ),
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
