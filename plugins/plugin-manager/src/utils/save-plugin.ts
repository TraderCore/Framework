import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PluginPath } from '@/constants.js';

export const savePlugin = async (code: string) => {
    // Create the plugins directory if it doesn't exist
    await fs.mkdir(PluginPath, { recursive: true });

    // Write the plugin code to a temporary file
    const tempFilePath = path.join(PluginPath, `${crypto.randomUUID()}.js`);

    await fs.writeFile(tempFilePath, code);

    return tempFilePath;
};
