import type { SQL } from 'bun';

export class PluginState {
    constructor(private readonly db: SQL) {}

    async isKnown(pluginName: string): Promise<boolean> {
        const rows = await this
            .db`SELECT 1 FROM plugins WHERE name = ${pluginName}`;
        return rows.length > 0;
    }

    async isEnabled(pluginName: string): Promise<boolean> {
        const rows = await this
            .db`SELECT enabled FROM plugins WHERE name = ${pluginName}`;
        return rows[0]?.enabled ?? false;
    }

    async register(
        pluginName: string,
        version: string,
        location: string,
        enabled: boolean,
    ): Promise<void> {
        await this.db`
            INSERT INTO plugins (name, version, location, enabled)
            VALUES (${pluginName}, ${version}, ${location}, ${enabled})
            ON CONFLICT (name) DO UPDATE SET
                version = EXCLUDED.version,
                location = EXCLUDED.location,
                updated_at = NOW()
        `;
    }

    async setEnabled(pluginName: string, enabled: boolean): Promise<void> {
        const result = await this.db`
            UPDATE plugins SET enabled = ${enabled}, updated_at = NOW() WHERE name = ${pluginName}
        `;

        if (result.count === 0) {
            throw new Error(`Plugin "${pluginName}" is not registered`);
        }
    }
}
