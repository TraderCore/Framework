import { defineConfig } from 'tsup';
// @ts-ignore
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    outExtension: () => ({ js: '.js' }),
    sourcemap: 'inline',
    minify: true,
    clean: true,
    bundle: true,
    outDir: 'dist',
    esbuildOptions: (options) => {
        options.define = {
            ...options.define,
            // biome-ignore lint/style/useNamingConvention: This is a constant
            VERSION: `"${pkg.version}"`,
        };
    },
});
