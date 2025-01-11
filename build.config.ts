import { defineBuildConfig } from 'unbuild';
import banner from 'rollup-plugin-banner2';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import replace from '@rollup/plugin-replace';

const version = JSON.parse(
  readFileSync(join(__dirname, 'package.json'), 'utf-8'),
).version;

export default defineBuildConfig({
  entries: [
    './packages/million',
    './packages/experimental',
    './packages/jsx-runtime',
    './packages/compiler',
    './packages/react',
    './packages/react-server',
    './packages/types',
    './packages/cli',
  ],
  declaration: true,
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  hooks: {
    'rollup:options'(_ctx, options) {
      if (Array.isArray(options?.plugins)) {
        options.plugins.push(banner(() => `'use client';\n`) as any);
        options.plugins.push(
          replace({
            preventAssignment: true,
            'process.env.VERSION': JSON.stringify(version),
          }),
        );
      }
    },
  },
  externals: ['react', 'react-dom', 'million', 'vite', 'esbuild', 'rollup'],
});
