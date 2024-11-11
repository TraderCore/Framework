import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';

import { DynamicModule, Global, Logger, Module } from '@nestjs/common';

interface PluginManagerOptions {
    registry: string[];
}

interface Plugin {
    name: string;
    version: string;
    module: unknown;
}

@Global()
@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: Most likely the only class that will be static only
export class PluginManagerModule {
    static async forRoot(
        options: PluginManagerOptions,
    ): Promise<DynamicModule> {
        const plugins: Plugin[] = [];

        const logger = new Logger(PluginManagerModule.name);

        try {
            const __dirname = path.dirname(new URL(import.meta.url).pathname);

            const pluginPath = path.join(
                __dirname,
                '../../template/dist/index.js',
            );

            const require = createRequire(pluginPath);

            // Read the actual file content instead of using import
            const pluginCode = await fs.readFile(pluginPath, 'utf8');

            const context = vm.createContext({
                console,
                require,
                process,
                Buffer,
                setTimeout,
                clearTimeout,
                setInterval,
                clearInterval,
                __dirname,
                __filename: pluginPath,
                module: { exports: {} },
                exports: {},
            });

            // Execute the code directly
            vm.runInContext(pluginCode, context);

            // Get the exports from the context
            const result = context.module.exports;
            logger.log(
                `Plugin loaded successfully: ${result.NAME}@${result.VERSION}`,
            );

            plugins.push({
                name: result.NAME,
                version: result.VERSION,
                module: result.Plugin,
            });
        } catch (error) {
            logger.error('Failed to load plugin:', error);
            throw error;
        }

        logger.log(`Loaded ${plugins.length} plugins`);

        return {
            module: PluginManagerModule,
            imports: plugins.map((plugin) => plugin.module as DynamicModule),
            providers: [],
            exports: [],
            global: true,
        };
    }
}
