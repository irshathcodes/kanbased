export class PermissionError extends Error {
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "Permission Error"
    this.message = message;
  }
}

export class UnprocessableEntityError extends Error {
  constructor(message = "Invalid board data") {
    super(message);
    this.name = "Unprocessable Entity Error"
    this.message = message;
  }
}