import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PLUGINS = Symbol('PLUGINS');
export const REGISTRIES = Symbol('REGISTRIES');

export const PluginPath = path.join(__dirname, 'plugins');
