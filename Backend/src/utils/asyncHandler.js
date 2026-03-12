/**
 * Wraps an async Express route handler to avoid repetitive try/catch blocks.
 * Any thrown error is forwarded to Express's next() error middleware.
 *
 * Usage:
 *   exports.myController = asyncHandler(async (req, res) => { ... });
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
