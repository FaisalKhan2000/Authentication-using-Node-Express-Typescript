export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}
export class UnAuthenticatedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnAuthenticatedError";
  }
}
export class UnAuthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnAuthorizedError";
  }
}
