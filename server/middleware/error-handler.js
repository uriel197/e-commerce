const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors");
//import logger from "winston"; // Example logging library

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
    errorCode: err.errorCode || "UNKNOWN_ERROR",
  };

  if (customError.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    console.log("Server error: ", err);
  }

  if (err instanceof CustomAPIError) {
    customError.msg = err.message;
    customError.statusCode = err.statusCode;
    customError.errorCode = err.errorCode || "CUSTOM_ERROR";
  }

  if (err.name === "ValidationError") {
    customError.msg = Object.entries(err.errors)
      .map(([field, item]) => `${field}: ${item.message}`)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.errorCode = "VALIDATION_ERROR";
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.errorCode = "DUPLICATE_KEY";
  }

  if (err.name === "CastError") {
    customError.msg = `Id number ${err.value} was not found in the Database`;
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.errorCode = "NOT_FOUND";
  }

  // Security: Ensures sensitive error details (e.g., stack traces) are not sent to the client in production
  if (
    process.env.NODE_ENV === "production" &&
    customError.statusCode === StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    customError.msg = "An error occurred";
    delete customError.errorCode;
  }

  return res.status(customError.statusCode).json({ customError });
};

module.exports = errorHandlerMiddleware;
