const ApiResponse = require("../utils/apiResponse");

/**
 * Restricts access to specified roles (e.g., 'admin', 'doctor')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 401, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        403,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource`
      );
    }

    next();
  };
};

module.exports = { authorize };
