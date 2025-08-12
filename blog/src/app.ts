import { Hono } from 'hono';
import 'dotenv/config';
import { serve } from '@hono/node-server';
import { appRouter } from './routes/index';
import logger from './middleware/logger';

const app = new Hono();

app.use('*', logger);
app.route('/', appRouter);

if (import.meta.main) {
  const port = Number(process.env.PORT) || 3000;
  serve({ fetch: app.fetch, port });
}

export default app;
