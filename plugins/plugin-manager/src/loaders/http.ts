import { getProtocolFile } from '@/utils/get-protocol-file.js';
import { savePlugin } from '@/utils/save-plugin.js';
import type { Plugin } from '../types.js';

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

    const pluginPath = await savePlugin(code);

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
