import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths'
import { viteStaticCopy as copy } from 'vite-plugin-static-copy'
import { externalizeDeps as external } from 'vite-plugin-externalize-deps';

import pkg from './package.json';

export default defineConfig(api => {
  return {
    appType: 'custom',
    plugins: [
      external({
        include: ['@zhengxs/dingtalk-event-hubs/_shims/auto/runtime']
      }),
      checker({
        typescript: true,
      }),
      tsconfigPaths(),
      dts(),
      dts({
        beforeWriteFile(filePath, content) {
          return {
            filePath: filePath.replace(/\.d\.ts$/, '.d.mts'),
            content,
          };
        },
      }),
      copy({
        targets: [
          { src: 'src', dest: '' },
          { src: 'src/_shims/{index,node-runtime}.{d.ts,js,mjs}', dest: 'src/_shims' },
          { src: 'README.md', dest: '' },
          { src: 'package.json', dest: '' },
        ],
      }),
    ],
    define: {
      __PKG_NAME__: JSON.stringify(pkg.name),
      __PKG_VERSION__: JSON.stringify(pkg.version),
    },
    esbuild: {
      // wechaty 的 UrlLink 内部会检查 class 的名字
      // 所以这里需要保留
      keepNames: true,
      minifyIdentifiers: false,
    },
    build: {
      target: 'esnext',
      sourcemap: false,
      copyPublicDir: false,
      emptyOutDir: api.mode === 'production',
      lib: {
        entry: {
          index: 'src/index.ts',
          '_shims/auto/runtime-node': 'src/_shims/auto/runtime-node.ts',
          '_shims/auto/runtime': 'src/_shims/auto/runtime.ts',
          'shims/web': 'src/shims/web.ts',
          'shims/node': 'src/shims/node.ts'
        },
        formats: ['es', 'cjs']
      },
      rollupOptions: {
        output: {
          exports: 'named',
          // See https://github.com/vitejs/vite/issues/5174
          preserveModules: true,
        },
      },
    },
  }
});
