import 'server-only';

import pino from 'pino';
import type { Logger } from 'pino';

const baseLogger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: { app: 'textilconnect' },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(process.env.NODE_ENV !== 'production'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname,app',
          },
        },
      }
    : {}),
});

export const createServiceLogger = (name: string): Logger =>
  baseLogger.child({ layer: 'service', name });

export const createRepositoryLogger = (name: string): Logger =>
  baseLogger.child({ layer: 'repository', name });

export const createApiLogger = (name: string): Logger =>
  baseLogger.child({ layer: 'api', name });

export const createActionLogger = (name: string): Logger =>
  baseLogger.child({ layer: 'action', name });
