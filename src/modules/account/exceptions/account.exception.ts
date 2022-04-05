export abstract class AccountException extends Error {
  constructor (readonly message: string, readonly metadata?: unknown) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }

  abstract code: string;
}
