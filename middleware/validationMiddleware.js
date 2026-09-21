const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");

/**
 * Checks express-validator results and returns standard 400 error format if any fail
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return ApiResponse.error(res, 400, "Validation failed", formattedErrors);
  }
  next();
};

module.exports = { validate };
