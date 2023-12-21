import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

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
  build: {
    target: 'esnext',
    sourcemap: true,
    copyPublicDir: false,
    reportCompressedSize: false,
    lib: {
      entry: {
        index: 'src/index.ts',
        'exports/web': 'src/exports/web.ts',
        'exports/node': 'src/exports/node.ts',
        'shims/web': 'src/shims/web.ts',
        'shims/node': 'src/shims/node.ts'
      },
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
