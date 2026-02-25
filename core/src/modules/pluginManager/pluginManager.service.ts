import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { SQL } from 'bun';
import { DATABASE } from '../database/constants.js';
import { PLUGINS } from './constants';
import type { PluginInternal } from './types/plugin';

export interface PluginResponse {
    name: string;
    version: string;
    location: string;
    enabled: boolean;
}

@Injectable()
export class PluginManagerService {
    constructor(
        @Inject(PLUGINS) private readonly plugins: PluginInternal[],
        @Inject(DATABASE) private readonly db: SQL,
    ) {}

    getPlugins(): PluginResponse[] {
        return this.plugins.map((p) => this.toResponse(p));
    }

    findPlugin(name: string): PluginInternal {
        const plugin = this.plugins.find((p) => p.name === name);

        if (!plugin) {
            throw new NotFoundException(`Plugin "${name}" not found`);
        }

        return plugin;
    }

    async enablePlugin(name: string) {
        const plugin = this.findPlugin(name);

        await this.db.unsafe(
            `UPDATE plugins SET enabled = true, updated_at = NOW() WHERE name = $1`,
            [name],
        );

        plugin.enabled = true;

        return {
            message:
                'Plugin enabled. A server restart is required for changes to take effect.',
            plugin: this.toResponse(plugin),
        };
    }

    async disablePlugin(name: string) {
        const plugin = this.findPlugin(name);

        await this.db.unsafe(
            `UPDATE plugins SET enabled = false, updated_at = NOW() WHERE name = $1`,
            [name],
        );

        plugin.enabled = false;

        return {
            message:
                'Plugin disabled. A server restart is required for changes to take effect.',
            plugin: this.toResponse(plugin),
        };
    }

    private toResponse(plugin: PluginInternal): PluginResponse {
        return {
            name: plugin.name,
            version: plugin.version,
            location: plugin.location,
            enabled: plugin.enabled,
        };
    }
}
