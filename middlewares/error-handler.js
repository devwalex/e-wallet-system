const httpStatus = require("http-status");

const sendErrorDev = (err, req, res) => {
  // Development error handling - send the full error stack trace
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // Production error handling - send a simpler error message without the stack trace
  console.error("ERROR", err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
  });
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    if (process.env.NODE_ENV === "production") {
      let error = { ...err };
      error.message = err.message;
      sendErrorProd(error, req, res);
    } else {
      sendErrorDev(err, req, res);
    }
  }
};

module.exports = errorHandler;
