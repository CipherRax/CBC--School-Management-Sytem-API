/**
 * Simple console logger with level-based formatting.
 * Replace with winston/pino for production use.
 */

const LOG_LEVELS = ["debug", "info", "warn", "error"] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

const currentLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ?? "debug";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(currentLevel);
}

function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  debug: (message: string, meta?: unknown) => {
    if (shouldLog("debug"))
      console.debug(`[${timestamp()}] DEBUG: ${message}`, meta ?? "");
  },
  info: (message: string, meta?: unknown) => {
    if (shouldLog("info"))
      console.info(`[${timestamp()}]  INFO: ${message}`, meta ?? "");
  },
  warn: (message: string, meta?: unknown) => {
    if (shouldLog("warn"))
      console.warn(`[${timestamp()}]  WARN: ${message}`, meta ?? "");
  },
  error: (message: string, meta?: unknown) => {
    if (shouldLog("error"))
      console.error(`[${timestamp()}] ERROR: ${message}`, meta ?? "");
  },
};
