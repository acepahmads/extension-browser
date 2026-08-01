/**
 * Business Error Domain Class - WP-4 Stage 1
 */
export class BusinessError extends Error {
  public readonly errorCode: string;
  public readonly isRecoverable: boolean;
  public readonly originalError?: Error;

  constructor(errorCode: string, message: string, isRecoverable = false, originalError?: Error) {
    super(message);
    this.name = 'BusinessError';
    this.errorCode = errorCode;
    this.isRecoverable = isRecoverable;
    this.originalError = originalError;
    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}
