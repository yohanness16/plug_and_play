import { Hono } from 'hono';
import 'dotenv/config';
import { serve } from '@hono/node-server';
import { appRouter } from './routes/index.js';
import logger from './middleware/logger.js';

declare const Bun: any; 

const app = new Hono();

app.use('*', logger);
app.route('/', appRouter);

const isMain =
  typeof Bun !== 'undefined'
    ? import.meta.main
    : process.argv[1] === new URL(import.meta.url).pathname;

if (isMain) {
  const port = Number(process.env.PORT) || 3001;
  serve({ fetch: app.fetch, port });
  console.log(`🚀 Server running at http://localhost:${port}`);
}

export default app;
