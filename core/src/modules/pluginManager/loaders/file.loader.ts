import fs from 'node:fs';
import type { Plugin } from '../types/plugin.js';
import { getProtocolFile } from '../utils/getProtocolFile.js';
import { SavePlugin } from '../utils/savePlugin.js';

export const loadFile = async (url: string): Promise<Plugin> => {
    const { protocol, path } = await getProtocolFile(url);

    if (protocol !== 'file') {
        throw new Error(`Unsupported protocol: ${protocol} for File Loader`);
    }

    const file = fs.readFileSync(path, 'utf8');

    const pluginPath = await SavePlugin(file);

    const module = await import(pluginPath).catch((error) => {
        throw new Error(`Failed to import module from ${url}: ${error}`);
    });

    return module.default;
};
