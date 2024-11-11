import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs'],
    outExtension: () => ({ js: '.js' }),
    sourcemap: true,
    clean: true,
    bundle: true,
    minify: true,
    outDir: 'dist',
});
