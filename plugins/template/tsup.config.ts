import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    outExtension: () => ({ js: '.js' }),
    sourcemap: 'inline',
    minify: true,
    clean: true,
    bundle: true,
    outDir: 'dist',
});
