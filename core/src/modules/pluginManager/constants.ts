import path from 'node:path';

export const PLUGINS = Symbol('PLUGINS');
export const REGISTRIES = Symbol('REGISTRIES');
export const ALLOWED_ENTRYPOINT_TYPES = Symbol('ALLOWED_ENTRYPOINT_TYPES');

const __dirname = path.dirname(new URL(import.meta.url).pathname);
export const PluginPath = path.join(__dirname, 'plugins');
