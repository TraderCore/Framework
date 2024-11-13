import { getProtocolFile } from '@/utils/get-protocol-file.js';
import type { Plugin } from '../types.js';

export const loadRegistry = async (
    url: string,
    apikey: string,
): Promise<Plugin> => {
    const { protocol, path } = await getProtocolFile(url);

    if (protocol !== 'registry') {
        throw new Error(
            `Unsupported protocol: ${protocol} for Registry Loader`,
        );
    }

    const response = await fetch(`https://${path}`, {
        headers: {
            Authorization: `Bearer ${apikey}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }

    const code = await response.text();

    const module = await import(code).catch(() => {
        throw new Error(`Failed to import module from ${url}`);
    });

    return {
        location: url,
        name: module.NAME,
        version: module.VERSION,
        module: module.Plugin,
    };
};
