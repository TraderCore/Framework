import path from 'node:path';
import { defineConfig } from 'tsup';

const watchFoldersRelative = ['src/**/*.ts', '../../core/dist/**/*.ts'];
const watchFoldersAbsolute = watchFoldersRelative.map((relativePath) =>
    path.resolve(__dirname, relativePath),
);

console.log(watchFoldersAbsolute);

export default defineConfig((options) => ({
    ...options,
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
    target: 'node18',
    outDir: 'dist',
    shims: true,
    noExternal: ['@tradercore/framework'],
    watch: options.watch ? watchFoldersAbsolute : false,
}));
