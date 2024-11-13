import path from 'node:path';

export const PLUGINS = Symbol('PLUGINS');

const __dirname = path.dirname(new URL(import.meta.url).pathname);
export const PluginPath = path.join(__dirname, 'plugins');
