import type { SQL } from 'bun';

const TABLE_NAME = 'plugins';

export class PluginState {
    constructor(private readonly db: SQL) {}

    async initialize(): Promise<void> {
        await this.db.unsafe(`
            CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                name TEXT PRIMARY KEY,
                version TEXT NOT NULL,
                location TEXT NOT NULL,
                enabled BOOLEAN NOT NULL DEFAULT false,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);
    }

    async isKnown(pluginName: string): Promise<boolean> {
        const rows = await this.db.unsafe(
            `SELECT 1 FROM ${TABLE_NAME} WHERE name = $1`,
            [pluginName],
        );
        return rows.length > 0;
    }

    async isEnabled(pluginName: string): Promise<boolean> {
        const rows = await this.db.unsafe(
            `SELECT enabled FROM ${TABLE_NAME} WHERE name = $1`,
            [pluginName],
        );
        return rows[0]?.enabled ?? false;
    }

    async register(
        pluginName: string,
        version: string,
        location: string,
        enabled: boolean,
    ): Promise<void> {
        await this.db.unsafe(
            `INSERT INTO ${TABLE_NAME} (name, version, location, enabled)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (name) DO UPDATE SET
                version = EXCLUDED.version,
                location = EXCLUDED.location,
                updated_at = NOW()`,
            [pluginName, version, location, enabled],
        );
    }

    async setEnabled(pluginName: string, enabled: boolean): Promise<void> {
        const result = await this.db.unsafe(
            `UPDATE ${TABLE_NAME} SET enabled = $1, updated_at = NOW() WHERE name = $2`,
            [enabled, pluginName],
        );

        if (result.count === 0) {
            throw new Error(`Plugin "${pluginName}" is not registered`);
        }
    }
}
