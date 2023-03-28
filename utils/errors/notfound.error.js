const httpStatus = require("http-status");
const AppError = require("./app.error");

class NotFoundError extends AppError {
  constructor(message = httpStatus[httpStatus.NOT_FOUND]) {
    super(message);
    this.statusCode = httpStatus.NOT_FOUND;
    this.isOperational = true;
  }
}

module.exports = NotFoundError;
