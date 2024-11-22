import type { Plugin } from '../types.js';
import { getProtocolFile } from '../utils/getProtocolFile.js';

export const loadFile = async (url: string): Promise<Plugin> => {
    const { protocol, path } = await getProtocolFile(url);

    if (protocol !== 'file') {
        throw new Error(`Unsupported protocol: ${protocol} for File Loader`);
    }

    const module = await import(path).catch(() => {
        throw new Error(`Failed to import module from ${url}`);
    });

    return {
        location: url,
        name: module.NAME,
        version: module.VERSION,
        module: module.Plugin,
    };
};
