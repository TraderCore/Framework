import { type DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { PluginMigrationSet } from '@tradercore/migration-engine';
import { MigrationRunner } from '@tradercore/migration-engine';
import { SQL } from 'bun';
import { DATABASE } from './constants.js';
import { DatabaseConfig, DatabaseConfigService } from './database.config.js';

interface DatabaseModuleOptions {
    migrations?: PluginMigrationSet[];
}

@Global()
@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: NestJS dynamic module pattern
export class DatabaseModule {
    private static readonly logger = new Logger(DatabaseModule.name);

    static forRoot(options?: DatabaseModuleOptions): DynamicModule {
        const migrations = options?.migrations ?? [];

        return {
            module: DatabaseModule,
            imports: [ConfigModule.forFeature(DatabaseConfig)],
            providers: [
                {
                    provide: DATABASE,
                    inject: [DatabaseConfigService],
                    useFactory: async (config: DatabaseConfigService) => {
                        DatabaseModule.logger.log(
                            `Connecting to database at ${config.host}:${config.port}/${config.database}`,
                        );

                        const db = new SQL({
                            hostname: config.host,
                            port: config.port,
                            username: config.user,
                            password: config.password,
                            database: config.database,
                            tls: config.ssl,
                            max: 20,
                            idleTimeout: 20,
                            connectionTimeout: 10,
                        });

                        if (migrations.length > 0) {
                            const runner = new MigrationRunner(db);
                            await runner.run(migrations);
                        }

                        DatabaseModule.logger.log(
                            'Database connection established',
                        );

                        return db;
                    },
                },
                DatabaseConfigService,
            ],
            exports: [DATABASE, DatabaseConfigService],
        };
    }
}
