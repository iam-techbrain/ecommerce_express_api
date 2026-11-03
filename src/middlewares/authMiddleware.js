const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return ApiResponse.unauthorized(res, 'Access denied. Authorization header is missing.');
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return ApiResponse.unauthorized(res, 'Invalid token format. Format should be: Bearer <token>');
  }

  const token = tokenParts[1];
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_crud_2026_xyz';

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token has expired. Please login again.', err.message);
    }
    return ApiResponse.unauthorized(res, 'Invalid or malformed token.', err.message);
  }
};

module.exports = authenticateToken;

