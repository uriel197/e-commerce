const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceObjectId) => {
  if (
    requestUser.userId === resourceObjectId.toString() ||
    requestUser.role === "admin"
  )
    return;
  throw new CustomError.UnauthorizedRequest("Access denied");
};

module.exports = checkPermissions;
