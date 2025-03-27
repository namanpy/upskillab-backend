export class CustomError extends Error {
  code: number;
  reference: number;

  constructor(input: { code: number; message: string; reference: number }) {
    super();
    this.code = input.code;
    this.reference = input.reference;
    this.message = input.message;

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
