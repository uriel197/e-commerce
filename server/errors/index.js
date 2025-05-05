const CustomAPIError = require("./custom-api");
const UnauthenticatedError = require("./unauthenticated");
const NotFoundError = require("./not-found");
const BadRequestError = require("./bad-request");
const UnauthorizedRequest = require("./unauthorizedRequest");
module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  UnauthorizedRequest,
  NotFoundError,
  BadRequestError,
};
