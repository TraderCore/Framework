import fs from 'node:fs';
import path from 'node:path';
import { type DynamicModule, Global, Logger, Module } from '@nestjs/common';
import type { PluginMigrationSet } from '@tradercore/migration-engine';
import { MigrationRunner } from '@tradercore/migration-engine';
import { SQL } from 'bun';
import { migrations as coreMigrations } from '../../migrations.js';
import { parseDatabaseConfig } from '../database/database.config.js';
import { DatabaseModule } from '../database/database.module.js';
import { PLUGINS } from './constants';
import { loadPlugin } from './loaders/loadPlugin';
import { PluginManagerController } from './pluginManager.controller';
import { PluginManagerService } from './pluginManager.service';
import type { PluginInternal } from './types/plugin';
import { PluginState } from './utils/pluginState';

interface PluginManagerOptions {
    plugins?: string[];
    devPluginDir?: string;
}

@Global()
@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: NestJS dynamic module pattern
export class PluginManagerModule {
    static async forRoot(
        options?: PluginManagerOptions,
    ): Promise<DynamicModule> {
        const logger = new Logger(PluginManagerModule.name);

        const dbConfig = parseDatabaseConfig();

        const client = new SQL({
            hostname: dbConfig.host,
            port: dbConfig.port,
            username: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            tls: dbConfig.ssl,
            max: 1,
            idleTimeout: 10,
            connectionTimeout: 10,
        });

        const runner = new MigrationRunner(client);
        await runner.run([{ pluginName: 'core', migrations: coreMigrations }]);

        const pluginState = new PluginState(client);

        const toLoad: string[] = [...(options?.plugins ?? [])];

        if (options?.devPluginDir) {
            const discovered = PluginManagerModule.discoverPlugins(
                options.devPluginDir,
            );

            for (const uri of discovered) {
                logger.log(`Discovered plugin: ${uri}`);
            }

            toLoad.push(...discovered);
        }

        const plugins: PluginInternal[] = [];

        for (const pluginUri of toLoad) {
            const loaded = await loadPlugin(pluginUri).catch((error: Error) => {
                logger.error(`Failed to load plugin ${pluginUri}: ${error}`);

                console.error(error);

                return null;
            });

            if (loaded) {
                const isNew = !(await pluginState.isKnown(loaded.name));

                if (isNew) {
                    await pluginState.register(
                        loaded.name,
                        loaded.version,
                        pluginUri,
                        false,
                    );
                    logger.warn(
                        `New plugin "${loaded.name}" discovered — registered as disabled`,
                    );
                } else {
                    await pluginState.register(
                        loaded.name,
                        loaded.version,
                        pluginUri,
                        await pluginState.isEnabled(loaded.name),
                    );
                }

                const enabled = await pluginState.isEnabled(loaded.name);

                logger.log(
                    `Loaded plugin ${loaded.name}@${loaded.version} from ${pluginUri} [${enabled ? 'enabled' : 'disabled'}]`,
                );

                const internal: PluginInternal = {
                    ...loaded,
                    location: pluginUri,
                    enabled,
                };

                plugins.push(internal);
            }
        }

        await client.close();

        const enabledPlugins = plugins.filter((p) => p.enabled);
        logger.log(
            `Loaded ${plugins.length} plugins (${enabledPlugins.length} enabled)`,
        );

        const migrationSets: PluginMigrationSet[] = [];

        for (const plugin of enabledPlugins) {
            if (plugin.migrations && plugin.migrations.length > 0) {
                migrationSets.push({
                    pluginName: plugin.name,
                    migrations: plugin.migrations,
                });
                logger.log(
                    `Queued ${plugin.migrations.length} migration(s) from plugin "${plugin.name}"`,
                );
            }
        }

        const pluginModules = enabledPlugins.map(
            (plugin) => plugin.module as DynamicModule,
        );

        return {
            module: PluginManagerModule,
            imports: [
                DatabaseModule.forRoot({
                    migrations: migrationSets,
                }),
                ...pluginModules,
            ],
            controllers: [PluginManagerController],
            providers: [
                {
                    provide: PLUGINS,
                    useValue: plugins,
                },
                PluginManagerService,
            ],
            exports: [PLUGINS],
        };
    }

    private static discoverPlugins(dir: string): string[] {
        const uris: string[] = [];

        if (!fs.existsSync(dir)) {
            return uris;
        }

        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isDirectory()) {
                continue;
            }

            const distIndex = path.join(dir, entry.name, 'dist', 'index.js');

            if (fs.existsSync(distIndex)) {
                uris.push(`file://${distIndex}`);
            }
        }

        return uris;
    }
}
