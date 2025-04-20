import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { PLUGINS, REGISTRIES } from './constants.js';
import { loadPlugin } from './loaders/loadPlugin.js';
import { PluginManagerController } from './pluginManager.controller.js';
import type { Plugin, PluginInternal } from './types/plugin.js';
import { PluginType } from './types/plugin.js';

type Registry = {
    url: string;
    authorization?: string;
};

type PluginManagerOptions = {
    /**
     * The registries to use to load plugins from.
     */
    registry: Registry[];

    /**
     * The plugins to load.
     */
    plugins: string[];

    /**
     * The Allowed Plugin Entrypoints Types.
     */
    allowedEntrypointTypes?: PluginType[];
};

@Global()
@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: Most likely the only class that will be static only
export class PluginManagerModule {
    private static readonly logger = new Logger(PluginManagerModule.name);

    static async forRoot(
        options: PluginManagerOptions,
    ): Promise<DynamicModule> {
        const plugins: Plugin[] = [];

        for (const pluginUri of options.plugins) {
            const loaded = await loadPlugin(pluginUri).catch((error) => {
                PluginManagerModule.logger.error(
                    `Failed to load plugin ${pluginUri}: ${error}`,
                );
                throw error;
            });

            if (loaded) {
                PluginManagerModule.logger.log(
                    `Loaded plugin ${loaded.name}@${loaded.version} from ${pluginUri}`,
                );

                const internal: PluginInternal = {
                    ...loaded,
                    location: pluginUri,
                };

                plugins.push(internal);
            }
        }

        // Get the allowed entrypoint types from the options or use the default
        const allowedEntrypoints = options.allowedEntrypointTypes ?? [
            PluginType.Api,
            PluginType.Processor,
            PluginType.Ingress,
        ];

        // Filter the plugins to only include the allowed entrypoint types
        const allowedPluginEntrypoints = plugins.flatMap((plugin) =>
            plugin.entrypoints.filter((entrypoint) =>
                allowedEntrypoints.includes(entrypoint.type),
            ),
        );

        PluginManagerModule.logger.log(`Loaded ${plugins.length} plugins`);
        PluginManagerModule.logger.log(
            `Loaded ${allowedPluginEntrypoints.length} plugin entrypoints: ${allowedPluginEntrypoints
                .map((entrypoint) => entrypoint.type)
                .join(', ')}`,
        );

        return {
            module: PluginManagerModule,
            imports: allowedPluginEntrypoints.map(
                (entrypoint) => entrypoint.module as DynamicModule,
            ),
            providers: [
                {
                    provide: PLUGINS,
                    useValue: plugins,
                },
                {
                    provide: REGISTRIES,
                    useValue: options.registry,
                },
            ],
            controllers: [PluginManagerController],
            exports: [],
            global: true,
        };
    }

    static async forRootAsync(
        options: PluginManagerOptions,
    ): Promise<DynamicModule> {
        return {
            module: PluginManagerModule,
            imports: [],
            providers: [],
        };
    }
}
