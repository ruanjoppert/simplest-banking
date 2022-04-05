import pino, { Logger as pinoLogger, LoggerOptions } from 'pino'
import { Logger } from '../../application/ports/logger.port'

export class PinoLogger implements Logger {
  public pino: pinoLogger

  public constructor (options?: LoggerOptions) {
    this.pino = pino(options)
  }

  public info (message: string, obj: object): void {
    this.pino.info(obj, message)
  }

  public error (obj: unknown, message?: string, ...meta: unknown[]): void {
    this.pino.error(obj, message, ...meta)
  }

  public debug (message: string, object: object = {}): void {
    this.pino.debug(object, message)
  }

  public warn (message: string, ...meta: unknown[]): void {
    this.pino.warn(message, ...meta)
  }
}
