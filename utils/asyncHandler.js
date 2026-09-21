/**
 * Wraps async route handlers to eliminate repetitive try-catch blocks
 * and pass uncaught rejections to Express error middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
