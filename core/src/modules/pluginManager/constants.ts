import path from 'node:path';

export const PLUGINS = Symbol('PLUGINS');
export const REGISTRIES = Symbol('REGISTRIES');

const __dirname = path.dirname(new URL(import.meta.url).pathname);
export const PluginPath = path.join(__dirname, 'plugins');
