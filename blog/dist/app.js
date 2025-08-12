import path from 'path';
import url from 'url';
import { Hono } from 'hono';
import 'dotenv/config';
import { serve } from '@hono/node-server';
import { appRouter } from './routes/index.js';
import logger from './middleware/logger.js';

const __filename = url.fileURLToPath(import.meta.url);

const app = new Hono();

app.use('*', logger);
app.route('/', appRouter);

const isMain = typeof Bun !== 'undefined'
    ? import.meta.main
    : process.argv[1] === __filename;

if (isMain) {
    const port = Number(process.env.PORT) || 3000;
    serve({ fetch: app.fetch, port });
    console.log(`🚀 Server running at http://localhost:${port}`);
}

export default app;
