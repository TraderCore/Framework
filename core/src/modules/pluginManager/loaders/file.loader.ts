import type { Plugin } from '../types/plugin.js';
import { getProtocolFile } from '../utils/getProtocolFile.js';

export const loadFile = async (url: string): Promise<Plugin> => {
    const { protocol, path } = await getProtocolFile(url);

    if (protocol !== 'file') {
        throw new Error(`Unsupported protocol: ${protocol} for File Loader`);
    }

    const module = await import(path).catch(() => {
        throw new Error(`Failed to import module from ${url}`);
    });

    console.log(module.def);

    return module.default;
};
