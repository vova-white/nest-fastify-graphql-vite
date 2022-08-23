import { bootstrap, start } from './main.bootstrap';

(async function () {
  const app = await bootstrap();
  await start(app);
})();
