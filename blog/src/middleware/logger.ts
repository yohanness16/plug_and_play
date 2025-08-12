import pino from 'pino';
import type { Context, Next } from 'hono';


export const logger = pino({
  transport: process.env.NODE_ENV === 'production' ? undefined : {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
});


export default async function loggerMiddleware(c: Context, next: Next) {
  const start = Date.now();

  logger.info({ method: c.req.method, path: c.req.url }, 'Incoming request');

  try {
    await next();
  } finally {
    const duration = Date.now() - start;
    logger.info({
      method: c.req.method,
      path: c.req.url,
      duration: `${duration}ms`,
      status: c.res.status || 200,
    }, 'Request completed');
  }
}
