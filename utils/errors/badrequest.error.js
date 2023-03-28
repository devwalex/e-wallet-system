const httpStatus = require("http-status");
const AppError = require("./app.error");

class BadRequestError extends AppError {
  constructor(message = httpStatus[httpStatus.BAD_REQUEST]) {
    super(message);
    this.statusCode = httpStatus.BAD_REQUEST;
    this.isOperational = true;
  }
}

module.exports = BadRequestError;
