import type { INestApplication } from '@nestjs/common';
import { exit } from 'process';
import type { ModuleNode, Plugin, ViteDevServer } from 'vite';

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
    app: INestApplication | null;
    isLoading: boolean;
  } = {
    app: null,
    isLoading: false,
  };

  const closeApp = async () => {
    if (store.isLoading) return;
    if (store.app) await store.app.close();
  };

  const buildApp = async (server: ViteDevServer, modules?: ModuleNode[]) => {
    if (store.isLoading || (modules && !modules.length)) return;

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
      server.ssrFixStacktrace(error);
      server.config.logger.error(error);
      store.isLoading = false;
    }
  };

  return {
    name: 'vite-plugin-nestjs',
    apply(_, { command, mode }) {
      return command === 'serve' && mode !== 'test';
    },
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
    handleHotUpdate: ({ server, modules }) => {
      void buildApp(server, modules);
    },
  };
}

export default VitePluginNest;
