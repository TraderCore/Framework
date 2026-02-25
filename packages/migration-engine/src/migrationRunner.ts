import { Logger } from '@nestjs/common';
import type { SQL } from 'bun';
import type { PluginMigrationSet } from './types';

const MIGRATION_TABLE = '_plugin_migrations';

export class MigrationRunner {
    private readonly logger = new Logger(MigrationRunner.name);

    constructor(private readonly db: SQL) {}

    async run(migrationSets: PluginMigrationSet[]): Promise<void> {
        await this.ensureMigrationTable();

        for (const { pluginName, migrations } of migrationSets) {
            const applied = await this.getAppliedVersions(pluginName);

            const pending = migrations.filter((m) => !applied.has(m.version));

            if (pending.length === 0) {
                this.logger.debug(`No pending migrations for "${pluginName}"`);
                continue;
            }

            this.logger.log(
                `Running ${pending.length} migration(s) for "${pluginName}"...`,
            );

            for (const migration of pending) {
                this.logger.log(
                    `  Applying "${pluginName}" v${migration.version}...`,
                );

                await this.db.begin(async (tx) => {
                    await tx.unsafe(migration.sql);
                    await tx.unsafe(
                        `INSERT INTO ${MIGRATION_TABLE} (plugin_name, version, applied_at) VALUES ($1, $2, NOW())`,
                        [pluginName, migration.version],
                    );
                });

                this.logger.log(
                    `  Applied "${pluginName}" v${migration.version}`,
                );
            }
        }
    }

    private async ensureMigrationTable(): Promise<void> {
        await this.db.unsafe(`
            CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE} (
                id SERIAL PRIMARY KEY,
                plugin_name TEXT NOT NULL,
                version TEXT NOT NULL,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                UNIQUE(plugin_name, version)
            )
        `);
    }

    private async getAppliedVersions(pluginName: string): Promise<Set<string>> {
        const rows = await this.db.unsafe(
            `SELECT version FROM ${MIGRATION_TABLE} WHERE plugin_name = $1 ORDER BY id ASC`,
            [pluginName],
        );

        return new Set(rows.map((r: { version: string }) => r.version));
    }
}
