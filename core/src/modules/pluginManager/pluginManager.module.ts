import { DynamicModule, Global, Logger, Module, Type } from '@nestjs/common';
import { PLUGINS, REGISTRIES } from './constants';
import { loadPlugin } from './loaders/loadPlugin';
import { PluginManagerController } from './pluginManager.controller';
import type { Plugin, PluginInternal } from './types/plugin';

interface PluginManagerOptions {
    registry: string[];
}

@Global()
@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PluginManagerModule {
    static async forRoot(
        options: PluginManagerOptions,
    ): Promise<DynamicModule> {
        const toLoad: string[] = [
            // 'file:///Users/thomasburridge/Projects/TraderCore/plugin-template/packages/main/dist/index.cjs',
            'file:///Users/thomasburridge/Projects/TraderCore/framework/plugins/template/dist/index.js',
        ];

        const registries: string[] = [
            'registry.tradercore.dev/v1',
            ...options.registry,
        ];

        const plugins: PluginInternal[] = [];

        const logger = new Logger(PluginManagerModule.name);

        for (const pluginUri of toLoad) {
            const loaded = await loadPlugin(pluginUri).catch((error: Error) => {
                logger.error(`Failed to load plugin ${pluginUri}: ${error}`);

                console.error(error);

                return null;
            });

            if (loaded) {
                logger.log(
                    `Loaded plugin ${loaded.name}@${loaded.version} from ${pluginUri}`,
                );

                const internal: PluginInternal = {
                    ...loaded,
                    location: pluginUri,
                    enabled: true,
                };

                plugins.push(internal);
            }
        }

        logger.log(`Loaded ${plugins.length} plugins`);

        const pluginModules = plugins.map(
            (plugin) => plugin.module as DynamicModule,
        );

        return {
            module: PluginManagerModule,
            imports: pluginModules,
            controllers: [PluginManagerController],
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
            exports: [PLUGINS, REGISTRIES],
        };
    }
}
