const ApiResponse = require("../utils/apiResponse");

/**
 * 404 handler for undefined routes
 */
const notFound = (req, res, next) => {
  return ApiResponse.error(res, 404, `Cannot find ${req.method} ${req.originalUrl} on this server`);
};

module.exports = notFound;
