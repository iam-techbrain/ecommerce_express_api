const express = require('express');
const cors = require('cors');
const setupSwagger = require('./config/swagger');
const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
setupSwagger(app);

// Root route
app.get('/', (req, res) => {
  return ApiResponse.success(res, 'Welcome to E-Commerce Express API', {
    documentation: '/api-docs',
    swagger_json: '/api-docs.json',
    health: '/api/health',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products'
    }
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

