import type { Plugin } from '../types.js';
import { getProtocolFile } from '../utils/getProtocolFile.js';
import { SavePlugin } from '../utils/savePlugin.js';

export const loadHttp = async (url: string): Promise<Plugin> => {
    const { protocol, path } = await getProtocolFile(url);

    if (protocol !== 'http' && protocol !== 'https') {
        throw new Error(`Unsupported protocol: ${protocol} for HTTP Loader`);
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }

    const code = await response.text();

    const pluginPath = await SavePlugin(code);

    const module = await import(pluginPath).catch(() => {
        throw new Error(`Failed to import module from ${url}`);
    });

    return {
        location: url,
        name: module.NAME,
        version: module.VERSION,
        module: module.Plugin,
    };
};
