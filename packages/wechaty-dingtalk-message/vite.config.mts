import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

import pkg from './package.json';

export default defineConfig({
  appType: 'custom',
  plugins: [
    externalizeDeps(),
    dts({
      outDir: './dist-types',
    }),
    checker({
      typescript: true,
    }),
  ],
  define: {
    __PKG_NAME__: JSON.stringify(pkg.name),
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
  esbuild: {
    // wechaty 的 UrlLink 内部会检查 class 的名字
    // 所以这里需要保留
    keepNames: true
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    copyPublicDir: false,
    reportCompressedSize: false,
    lib: {
      entry: 'src/index.ts'
    },
    rollupOptions: {
      output: [
        {
          format: 'esm',
          dir: 'dist',
          exports: 'named',
          entryFileNames: '[name].mjs',
          chunkFileNames: '[name].mjs',
        },
        {
          format: 'cjs',
          dir: 'dist',
          exports: 'named',
          entryFileNames: '[name].cjs',
          chunkFileNames: '[name].cjs',
        },
      ],
    },
  },
});
