const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce REST API with Express, Supabase & JWT Auth',
    version: '1.0.0',
    description: `### Complete E-Commerce REST API Documentation
- **Architecture**: Express.js with Supabase Database
- **Identifier**: Uses \`uid\` (UUID v4) for all resources
- **Standardized Response**: All endpoints return a universal response structure via \`ApiResponse\` utility
- **Security**: JWT Authentication with Bearer token

To access protected endpoints:
1. Register via \`POST /api/auth/register\` or Login via \`POST /api/auth/login\`
2. Copy the \`token\` from response
3. Click the **Authorize** button on top-right and enter: \`<your-token>\``
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token directly'
      }
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          statusCode: { type: 'integer', example: 200 },
          message: { type: 'string', example: 'Operation successful' },
          data: { type: 'object', nullable: true },
          error: { type: 'string', nullable: true, example: null },
          timestamp: { type: 'string', format: 'date-time', example: '2026-11-04T00:00:00.000Z' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          password: { type: 'string', format: 'password', minLength: 6, example: 'securePassword123' },
          name: { type: 'string', example: 'John Doe' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          password: { type: 'string', format: 'password', example: 'securePassword123' }
        }
      },
      CategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Electronics' },
          description: { type: 'string', example: 'Smartphones, Laptops, and Accessories' }
        }
      },
      Category: {
        type: 'object',
        properties: {
          uid: { type: 'string', format: 'uuid', example: '497f6eca-6276-4993-bfeb-53cbbbba6f08' },
          name: { type: 'string', example: 'Electronics' },
          description: { type: 'string', example: 'Smartphones, Laptops, and Accessories' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      ProductRequest: {
        type: 'object',
        required: ['name', 'price', 'quantity'],
        properties: {
          name: { type: 'string', example: 'iPhone 15 Pro Max' },
          price: { type: 'number', format: 'float', example: 1199.99 },
          quantity: { type: 'integer', example: 25, description: 'Product quantity (or contaty)' },
          description: { type: 'string', example: '256GB Natural Titanium flagship smartphone' },
          category_uid: { 
            type: 'string', 
            format: 'uuid', 
            example: '497f6eca-6276-4993-bfeb-53cbbbba6f08',
            description: 'UID of the category selected from Categories table' 
          }
        }
      },
      Product: {
        type: 'object',
        properties: {
          uid: { type: 'string', format: 'uuid', example: 'd3b07384-d113-4a5f-9729-379f82d1c64d' },
          name: { type: 'string', example: 'iPhone 15 Pro Max' },
          price: { type: 'number', example: 1199.99 },
          quantity: { type: 'integer', example: 25 },
          description: { type: 'string', example: '256GB Natural Titanium flagship smartphone' },
          category_uid: { type: 'string', format: 'uuid', example: '497f6eca-6276-4993-bfeb-53cbbbba6f08' },
          category: { $ref: '#/components/schemas/Category' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  tags: [
    { name: 'Auth', description: 'User registration, login, and profile using JWT' },
    { name: 'Categories', description: 'Category management (Select category for products)' },
    { name: 'Products', description: 'Products CRUD with price, quantity, description, category' }
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
          },
          400: { description: 'Bad Request / User already exists' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user and get JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful with JWT token',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
          },
          400: { description: 'Invalid email or password' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'User profile retrieved successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
          },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get all categories',
        responses: {
          200: {
            description: 'List of all categories',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
          }
        }
      },
      post: {
        tags: ['Categories'],
        summary: 'Create a new category',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Category created successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
          },
          400: { description: 'Validation error' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/categories/{uid}': {
      get: {
        tags: ['Categories'],
        summary: 'Get category by UID',
        parameters: [
          { name: 'uid', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Category details' },
          404: { description: 'Category not found' }
        }
      },
      put: {
        tags: ['Categories'],
        summary: 'Update category by UID',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'uid', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Category updated successfully' },
          401: { description: 'Unauthorized' },
          404: { description: 'Category not found' }
        }
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete category by UID',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'uid', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Category deleted successfully' },
          401: { description: 'Unauthorized' },
          404: { description: 'Category not found' }
        }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products (with category relation)',
        parameters: [
          {
            name: 'category_uid',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
            description: 'Filter products by Category UID'
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter products by name keyword'
          }
        ],
        responses: {
          200: {
            description: 'List of products retrieved successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product (Select category by category_uid)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Product created successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
          },
          400: { description: 'Validation error (invalid price, missing fields, invalid category_uid)' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/products/{uid}': {
      get: {
        tags: ['Products'],
        summary: 'Get single product by UID',
        parameters: [
          { name: 'uid', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Product details with category' },
          404: { description: 'Product not found' }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Edit / Update product by UID',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'uid', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Product updated successfully' },
          400: { description: 'Validation error' },
          401: { description: 'Unauthorized' },
          404: { description: 'Product not found' }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete product by UID',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'uid', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Product deleted successfully' },
          401: { description: 'Unauthorized' },
          404: { description: 'Product not found' }
        }
      }
    }
  }
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'CRUD API Swagger Docs',
    customCss: '.swagger-ui .topbar { background-color: #1e293b; }'
  }));

  // Expose JSON spec as well
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
};

module.exports = setupSwagger;

