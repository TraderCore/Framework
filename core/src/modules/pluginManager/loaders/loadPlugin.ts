import type { Plugin } from '../types/plugin.js';
import { Registry } from '../types/registry.js';
import { getProtocolFile } from '../utils/getProtocolFile.js';
import { loadFile } from './file.loader.js';
import { loadHttp } from './http.loader.js';
import { loadRegistry } from './registry.loader.js';

export const loadPlugin = async (
    url: string,
    registries: Registry[],
): Promise<Plugin> => {
    const { protocol } = await getProtocolFile(url);

    switch (protocol) {
        case 'file':
            return loadFile(url);
        case 'http':
        case 'https':
            return loadHttp(url);
        case 'registry':
            return loadRegistry(url, registries);
        default:
            throw new Error(
                `Unsupported protocol: ${protocol} for Plugin Loader`,
            );
    }
};
