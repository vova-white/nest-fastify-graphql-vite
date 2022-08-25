/// <reference types="vitest" />
import multiInput from 'rollup-plugin-multi-input';
import swc from 'unplugin-swc';
import { defineConfig } from 'vite';
import ViteRestart from 'vite-plugin-restart';
import ViteNest from './vite-plugin-nestjs';

export default defineConfig(({ command }) => {
  const isCjs = process.argv.some((val) => val === '--cjs');
  const isBuild = command === 'build';
  const appPath = './src/main.bootstrap.ts';
  const buildInput = ['./src/**/*.ts']; // './src/main.ts for bundle to one file

  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: isBuild ? buildInput : appPath,
        output: {
          format: isBuild && isCjs ? 'cjs' : 'es',
          sourcemap: true,
        },
        plugins: [isBuild && multiInput()],
      },
    },
    test: {
      include: ['**/*.{spec,test,e2e-spec}.{js,mjs,cjs,ts}'],
    },
    optimizeDeps: {
      // To prevent error:
      // Big integer literals are not available in the configured target environment.
      esbuildOptions: { target: 'es2020' },

      // To prevent error:
      // Could not resolve "PACKAGE_NAME".
      // Vite does not work well with optionnal dependencies.
      // You can mark the path "PACKAGE_NAME" as external to exclude it from the bundle, which will remove
      // this error. You can also surround this "require" call with a try/catch block to handle this
      // failure at run-time instead of bundle-time.
      exclude: [
        '@nestjs/platform-express',
        '@nestjs/microservices',
        '@nestjs/websockets',
        'cache-manager',
        // 'class-transformer',
        // 'class-validator',
        'class-transformer/storage',
        '@fastify/view',
        // GraphQL dependencies.
        '@apollo/subgraph',
        'ts-morph',
        'apollo-server-express',
        '@apollo/gateway',
        'fsevents',
        'point-of-view',
      ],
    },
    plugins: [
      swc.vite({
        tsconfigFile: './tsconfig.build.json',
      }),
      ViteRestart({
        restart: ['vite.server.mjs'],
      }),
      ViteNest({ appPath }),
    ],
  };
});
