export interface Logger {
  info(message: string, ...meta: unknown[]): void;
  error(message: string, obj: unknown, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
  debug(message: string, ...meta: unknown[]): void;
}
