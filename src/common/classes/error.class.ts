export class CustomError extends Error {
  code: number;
  reference: string;

  constructor(code: number, message: string, reference: string) {
    super(message);
    this.code = code;
    this.reference = reference;

    // Set the prototype explicitly to maintain instanceof checks
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      reference: this.reference,
    };
  }
}
