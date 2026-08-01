/**
 * Enterprise Structured Logging Service for SPPG Browser Extension
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  SUCCESS = 2,
  WARN = 3,
  ERROR = 4
}

export type LoggerMode = 'development' | 'production';

export class Logger {
  private static level: LogLevel = LogLevel.DEBUG;
  private static mode: LoggerMode = 'development';
  private static prefix = '[SPPG Extension]';

  public static setLogLevel(level: LogLevel): void {
    this.level = level;
  }

  public static setMode(mode: LoggerMode): void {
    this.mode = mode;
    if (mode === 'production') {
      // Production Silent Mode: default to WARN unless explicitly changed
      this.level = LogLevel.WARN;
    } else {
      this.level = LogLevel.DEBUG;
    }
  }

  public static getMode(): LoggerMode {
    return this.mode;
  }

  public static debug(module: string, message: string, ...details: unknown[]): void {
    if (this.mode === 'production') return; // Silent in production mode
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`%c${this.prefix} [${module}] [DEBUG]`, 'color: #60a5fa; font-weight: bold;', message, ...details);
    }
  }

  public static info(module: string, message: string, ...details: unknown[]): void {
    if (this.mode === 'production') return; // Silent in production mode
    if (this.level <= LogLevel.INFO) {
      console.info(`%c${this.prefix} [${module}] [INFO]`, 'color: #3b82f6; font-weight: bold;', message, ...details);
    }
  }

  public static success(module: string, message: string, ...details: unknown[]): void {
    if (this.level <= LogLevel.SUCCESS) {
      console.info(`%c${this.prefix} [${module}] [SUCCESS]`, 'color: #10b981; font-weight: bold;', message, ...details);
    }
  }

  public static warn(module: string, message: string, ...details: unknown[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`%c${this.prefix} [${module}] [WARN]`, 'color: #f59e0b; font-weight: bold;', message, ...details);
    }
  }

  public static error(module: string, message: string, ...details: unknown[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`%c${this.prefix} [${module}] [ERROR]`, 'color: #ef4444; font-weight: bold;', message, ...details);
    }
  }
}
