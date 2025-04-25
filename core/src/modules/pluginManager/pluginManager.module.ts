import { DynamicModule, Logger } from '@nestjs/common';
import { ALLOWED_ENTRYPOINT_TYPES, PLUGINS, REGISTRIES } from './constants.js';
import { loadPlugin } from './loaders/loadPlugin.js';
import { PluginManagerController } from './pluginManager.controller.js';
import { PluginManagerOptions } from './types/moduleOptions.js';
import type { Plugin, PluginEntrypoint } from './types/plugin.js';
import { IsPluginType, PluginType } from './types/plugin.js';
import { Registry } from './types/registry.js';

// biome-ignore lint/complexity/noStaticOnlyClass: Most likely the only class that will be static only
export class PluginManagerModule {
    private static readonly logger = new Logger(PluginManagerModule.name);

    static async register(
        options: PluginManagerOptions,
    ): Promise<DynamicModule> {
        PluginManagerModule.logger.log(
            `Registering PluginManagerModule with options: ${JSON.stringify(
                options,
            )}`,
            {
                registriesString: options.registriesString,
                pluginsString: options.pluginsString,
                allowedEntrypointTypesString:
                    options.allowedEntrypointTypesString,
            },
        );

        const registries = PluginManagerModule.mapRegistries(
            options.registriesString,
        );

        PluginManagerModule.logger.log(
            `Loaded ${registries.length} registries`,
            {
                registries,
            },
        );

        const allowedEntrypointsTypes =
            PluginManagerModule.mapAllowedEntrypoints(
                options.allowedEntrypointTypesString,
            );

        const plugins = await PluginManagerModule.getPlugins(
            options.pluginsString,
            registries,
        );

        // Filter the plugins to only include the allowed entrypoint types
        const allowedPluginEntrypoints =
            PluginManagerModule.getAllowedEntrypoints(
                plugins,
                allowedEntrypointsTypes,
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
                    useValue: registries,
                },
                {
                    provide: ALLOWED_ENTRYPOINT_TYPES,
                    useValue: allowedEntrypointsTypes,
                },
            ],
            controllers: [PluginManagerController],
            exports: [],
            global: true,
        };
    }

    private static mapRegistries(registriesString: string): Registry[] {
        return registriesString
            .split(',')
            .map((registry) => {
                const [url, authorization] = registry.split(':');

                if (!url) {
                    PluginManagerModule.logger.error(
                        `Invalid registry: ${registry}`,
                    );
                    return null;
                }

                return { url, authorization };
            })
            .filter((registry) => registry !== null) as Registry[];
    }

    private static mapAllowedEntrypoints(
        allowedEntrypointsTypesString?: string,
    ): PluginType[] {
        if (!allowedEntrypointsTypesString) {
            return Object.values(PluginType);
        }

        return allowedEntrypointsTypesString
            .split(',')
            .map((type) => {
                if (IsPluginType(type)) {
                    return type;
                }
            })
            .filter((type) => type !== undefined) as PluginType[];
    }

    private static getAllowedEntrypoints(
        plugins: Plugin[],
        allowedEntrypointsTypes: PluginType[],
    ): PluginEntrypoint[] {
        PluginManagerModule.logger.debug('Getting allowed entrypoints');

        const allowedEntrypoints = plugins.flatMap((plugin) =>
            plugin.entrypoints.filter((entrypoint) =>
                allowedEntrypointsTypes.includes(entrypoint.type),
            ),
        );

        PluginManagerModule.logger.debug(
            `Got ${allowedEntrypoints.length} allowed entrypoints`,
        );

        return allowedEntrypoints;
    }

    private static async getPlugins(
        pluginsString: string,
        registries: Registry[],
    ): Promise<Plugin[]> {
        PluginManagerModule.logger.debug(`Getting plugins: ${pluginsString}`);
        const pluginsToLoad = pluginsString.split(',');

        PluginManagerModule.logger.debug(
            `Plugins to load: ${pluginsToLoad.join(', ')}`,
        );

        const plugins: Plugin[] = [];

        for (const pluginUri of pluginsToLoad) {
            const loaded = await loadPlugin(pluginUri, registries).catch(
                (error) => {
                    PluginManagerModule.logger.error(
                        `Failed to load plugin ${pluginUri}: ${error}`,
                    );
                    return null;
                },
            );

            if (loaded) {
                plugins.push(loaded);
            }
        }

        PluginManagerModule.logger.debug(`Got ${plugins.length} plugins`);

        return plugins;
    }
}
