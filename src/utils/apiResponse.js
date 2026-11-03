/**
 * Universal API Response Utility
 * Ensures a consistent response structure across the entire application.
 *
 * Format:
 * {
 *   success: boolean,
 *   statusCode: number,
 *   message: string,
 *   data: any | null,
 *   error: any | null,
 *   timestamp: string
 * }
 */

class ApiResponse {
  /**
   * Send a successful response
   */
  static success(res, message = 'Operation successful', data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      error: null,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send a 201 Created response
   */
  static created(res, message = 'Resource created successfully', data = null) {
    return this.success(res, message, data, 201);
  }

  /**
   * Send an error response
   */
  static error(res, message = 'Internal Server Error', error = null, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      data: null,
      error: typeof error === 'object' && error !== null ? (error.message || error) : error,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send a 400 Bad Request error
   */
  static badRequest(res, message = 'Bad Request / Validation Error', error = null) {
    return this.error(res, message, error, 400);
  }

  /**
   * Send a 401 Unauthorized error
   */
  static unauthorized(res, message = 'Unauthorized: Access token missing or invalid', error = null) {
    return this.error(res, message, error, 401);
  }

  /**
   * Send a 403 Forbidden error
   */
  static forbidden(res, message = 'Forbidden: Access denied', error = null) {
    return this.error(res, message, error, 403);
  }

  /**
   * Send a 404 Not Found error
   */
  static notFound(res, message = 'Resource not found', error = null) {
    return this.error(res, message, error, 404);
  }
}

module.exports = ApiResponse;

