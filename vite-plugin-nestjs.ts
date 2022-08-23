import type { NestApplication } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import type { Plugin, ViteDevServer } from 'vite';
import { exit } from 'process';

interface Options {
  /**
   * The project entry
   */
  appPath?: string;
  /**
   * Optional: The name of the bootstrap function
   *
   * @default bootstrap
   */
  bootstrapName?: string;
  /**
   * Optional: The name of the start function
   *
   * @default start
   */
  startName?: string;
}

function VitePluginNest(options: Options = {}): Plugin {
  const { appPath, bootstrapName = 'bootstrap', startName = 'start' } = options;
  if (!appPath || !bootstrapName || !startName) {
    console.error('Please setup VitePluginNestJS in your vite.config.js first');
    exit(1);
  }

  const store: {
    app: NestApplication | NestFastifyApplication | null;
    isLoading: boolean;
  } = {
    app: null,
    isLoading: false,
  };

  const closeApp = async () => {
    if (store.isLoading) return;
    if (store.app) await store.app.close();
  };

  const buildApp = async (server: ViteDevServer) => {
    if (store.isLoading) return;

    store.isLoading = true;
    try {
      const module = await server.ssrLoadModule(appPath);

      const bootstrap = module[bootstrapName];
      const start = module[startName];

      if (!bootstrap || !start) {
        server.config.logger.error(
          `Failed to find a named export ${[bootstrapName, startName].join(
            ' and ',
          )} from ${appPath}`,
        );
        exit(1);
      }

      const app = await bootstrap();
      app.use(server.middlewares);
      await start(app);

      store.app = app;
      store.isLoading = false;
    } catch (error) {
      store.isLoading = false;
      server.ssrFixStacktrace(error);
      server.config.logger.error(error);
    }
  };

  return {
    name: 'vite-plugin-nestjs',
    apply: 'serve',
    config: () => ({
      server: {
        middlewareMode: true,
      },
      appType: 'custom',
    }),
    configureServer: (server) => {
      void buildApp(server);

      server.watcher.prependListener('add', closeApp);
      server.watcher.prependListener('change', closeApp);
      server.watcher.prependListener('unlink', closeApp);
    },
    handleHotUpdate: ({ server }) => {
      void buildApp(server);
    },
  };
}

export default VitePluginNest;
