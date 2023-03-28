const httpStatus = require("http-status");
const AppError = require("./app.error");

class UnAuthorizedError extends AppError {
  constructor(message = httpStatus[httpStatus.UNAUTHORIZED]) {
    super(message);
    this.statusCode = httpStatus.UNAUTHORIZED;
    this.isOperational = true;
  }
}

module.exports = UnAuthorizedError;
