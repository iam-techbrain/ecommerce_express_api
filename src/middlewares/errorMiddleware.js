const ApiResponse = require('../utils/apiResponse');

// 404 Route Not Found Middleware
const notFoundHandler = (req, res, next) => {
  return ApiResponse.notFound(res, `Route not found: ${req.method} ${req.originalUrl}`);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return ApiResponse.error(res, message, process.env.NODE_ENV === 'development' ? err.stack : undefined, statusCode);
};

module.exports = {
  notFoundHandler,
  errorHandler
};

