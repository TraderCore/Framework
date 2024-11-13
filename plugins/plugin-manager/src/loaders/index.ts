import { getProtocolFile } from '@/utils/get-protocol-file.js';
import type { Plugin } from '../types.js';
import { loadFile } from './file.js';
import { loadHttp } from './http.js';
import { loadRegistry } from './registry.js';

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
