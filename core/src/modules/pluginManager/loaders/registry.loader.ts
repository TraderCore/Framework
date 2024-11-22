import type { Plugin } from '../types.js';
import { getProtocolFile } from '../utils/getProtocolFile.js';

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
            // biome-ignore lint/style/useNamingConvention: API key is always provided as Authorization header
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
