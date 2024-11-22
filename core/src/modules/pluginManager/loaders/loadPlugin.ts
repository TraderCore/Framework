import type { Plugin } from '../types.js';
import { getProtocolFile } from '../utils/getProtocolFile.js';
import { loadFile } from './file.loader.js';
import { loadHttp } from './http.loader.js';
import { loadRegistry } from './registry.loader.js';

export const loadPlugin = async (
    url: string,
    apikey?: string,
): Promise<Plugin> => {
    const { protocol } = await getProtocolFile(url);

    switch (protocol) {
        case 'file':
            return loadFile(url);
        case 'http':
        case 'https':
            return loadHttp(url);
        case 'registry':
            return loadRegistry(url, apikey ?? '');
        default:
            throw new Error(
                `Unsupported protocol: ${protocol} for Plugin Loader`,
            );
    }
};
