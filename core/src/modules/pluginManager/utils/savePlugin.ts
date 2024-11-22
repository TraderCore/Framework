import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PluginPath } from '../constants.js';

export const SavePlugin = async (code: string) => {
    // Create the plugins directory if it doesn't exist
    await fs.mkdir(PluginPath, { recursive: true });

    // MD5 hash the code
    const hash = crypto.createHash('md5').update(code).digest('hex');

    // Write the plugin code to a temporary file
    const tempFilePath = path.join(PluginPath, `${hash}.js`);

    await fs.writeFile(tempFilePath, code);

    return tempFilePath;
};
