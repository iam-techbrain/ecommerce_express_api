# Express.js E-Commerce REST API

A production-grade RESTful backend application built with Express.js, Supabase (PostgreSQL), JSON Web Token (JWT) authentication, and interactive Swagger UI documentation.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Directory Structure](#project-directory-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup Guide](#installation-and-setup-guide)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Install Dependencies](#step-2-install-dependencies)
  - [Step 3: Database Setup on Supabase](#step-3-database-setup-on-supabase)
  - [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
  - [Step 5: Run the Server](#step-5-run-the-server)
  - [Step 6: Verify Installation](#step-6-verify-installation)
- [API Documentation and Swagger UI](#api-documentation-and-swagger-ui)
- [Standardized API Response Format](#standardized-api-response-format)
- [API Endpoints Reference](#api-endpoints-reference)
  - [System and Health Endpoints](#system-and-health-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Category Management Endpoints](#category-management-endpoints)
  - [Product Management Endpoints](#product-management-endpoints)
- [Sample Requests and Payloads](#sample-requests-and-payloads)
- [Error Handling and HTTP Status Codes](#error-handling-and-http-status-codes)
- [License and Contribution](#license-and-contribution)

---

## Overview

This project provides an e-commerce backend service covering user authentication, product management, and categorical relationships. It is designed around clean architecture principles, featuring centralized error handling, unified response formatting, relational data modeling, and self-documenting OpenAPI specifications.

---

## Key Features

- Standardized API Response: Every request returns a structured JSON payload with unified metadata (`success`, `statusCode`, `message`, `data`, `error`, `timestamp`).
- Relational Database Modeling: Relational schema in PostgreSQL (hosted on Supabase) utilizing foreign keys (`ecommerce_express_products.category_uid -> ecommerce_express_categories.uid`) and automatic cascading.
- UUID v4 Primary Keys: All records utilize universally unique identifiers (`uid`) instead of auto-incrementing serial IDs for enhanced security and scalability.
- JWT Authentication: Secure user registration and login workflows with `bcryptjs` password hashing and stateless JSON Web Token verification.
- Interactive OpenAPI 3.0 Documentation: Built-in Swagger UI with integrated Bearer Token authorization at `/api-docs`.
- Dual Field Compatibility: The product controller supports both `quantity` and legacy `contaty` fields seamlessly in request payloads.
- Production-Ready Middleware: Configured with CORS, JSON body parsers, URL-encoded body parsers, 404 route handling, and centralized global exception management.

---

## Technology Stack

### Core Framework and Runtime
- Node.js (v18.x or higher)
- Express.js (v5.x)

### Database and Infrastructure
- Supabase (Managed PostgreSQL)
- `@supabase/supabase-js` (Supabase Client SDK)
- `ws` (WebSocket transport for Supabase Realtime client connections)

### Security and Authentication
- `jsonwebtoken` (JWT token generation and verification)
- `bcryptjs` (Password hashing and salt generation)
- `cors` (Cross-Origin Resource Sharing middleware)

### Documentation and Utilities
- `swagger-ui-express` (Swagger UI rendering middleware)
- `swagger-jsdoc` (OpenAPI schema generator)
- `dotenv` (Environment variable configuration management)
- `uuid` (UUID v4 generation)

---

## Project Directory Structure

```text
ecommerce_express_api/
|-- .env                             # Active environment configuration (kept secret, gitignored)
|-- .env.example                     # Environment configuration template
|-- .gitignore                       # Git exclusion rules (node_modules, .env, etc.)
|-- package.json                     # Application manifest, dependencies, and execution scripts
|-- package-lock.json                # Deterministic dependency lock file
|-- README.md                        # Complete project documentation
|-- supabase_schema.sql              # PostgreSQL DDL schema and initial seed data for Supabase
`-- src/
    |-- app.js                       # Express application assembly, middleware, and route mounting
    |-- server.js                    # Server startup script, port listener, and graceful shutdown handlers
    |-- config/
    |   |-- supabase.js              # Supabase client instantiation and client configuration
    |   `-- swagger.js               # OpenAPI / Swagger definition schemas and UI mounting
    |-- controllers/
    |   |-- authController.js        # Controller for user registration, authentication, and profile
    |   |-- categoryController.js    # Controller for category CRUD operations
    |   `-- productController.js     # Controller for product CRUD operations and category population
    |-- middlewares/
    |   |-- authMiddleware.js        # JWT Bearer token validation and request context population
    |   `-- errorMiddleware.js       # 404 Not Found handler and global error-handling middleware
    |-- routes/
    |   |-- index.js                 # Central route aggregator and system health check route
    |   |-- authRoutes.js            # Route definitions for /api/auth endpoints
    |   |-- categoryRoutes.js        # Route definitions for /api/categories endpoints
    |   `-- productRoutes.js         # Route definitions for /api/products endpoints
    `-- utils/
        `-- apiResponse.js           # Universal response formatter utility class
```

---

## Prerequisites

Before setting up the project, ensure that the following tools are installed on your workstation:

1. Node.js: Version 18.0.0 or higher. Verify using:
   ```bash
   node -v
   ```
2. npm (Node Package Manager): Version 9.0.0 or higher. Verify using:
   ```bash
   npm -v
   ```
3. Git: Installed and configured on your system. Verify using:
   ```bash
   git --version
   ```
4. Supabase Account: A free account on [Supabase](https://supabase.com).

---

## Installation and Setup Guide

Follow these steps sequentially to set up and run the project from source.

### Step 1: Clone the Repository

Clone the project repository to your local computer and change directory into the project folder:

```bash
git clone https://github.com/your-username/ecommerce_express_api.git
cd ecommerce_express_api
```

*(Replace `https://github.com/your-username/backend_ecommerce_express.git` with your actual repository URL)*

### Step 2: Install Dependencies

Install all production and development dependencies declared in `package.json`:

```bash
npm install
```

### Step 3: Database Setup on Supabase

1. Log in to your [Supabase Dashboard](https://app.supabase.com).
2. Create a new project (e.g., `ecommerce-db`) and set a strong database password.
3. Once the project is provisioned, click on the **SQL Editor** tab from the left sidebar navigation.
4. Click **New Query**.
5. Open the `supabase_schema.sql` file from this repository, copy its entire contents, paste them into the SQL Editor, and click **Run**.
6. The script will execute the following operations:
   - Enable the `pgcrypto` extension for generating UUIDs.
   - Create the `ecommerce_express_users` table with email uniqueness and password constraints.
   - Create the `ecommerce_express_categories` table.
   - Create the `ecommerce_express_products` table with foreign key linkage to `ecommerce_express_categories(uid)`.
   - Create an index `idx_ecom_exp_products_category_uid` for optimized relational queries.
   - Configure Row Level Security (RLS) policies for API access.
   - Seed default initial categories (`Electronics`, `Fashion`, `Home Appliances`).
7. Navigate to **Project Settings** (gear icon) -> **API** and copy:
   - **Project URL**
   - **anon / public key** or **service_role key**

### Step 4: Configure Environment Variables

1. Create a `.env` file in the project root directory by copying `.env.example`:

   On Linux / macOS:
   ```bash
   cp .env.example .env
   ```

   On Windows (Command Prompt):
   ```cmd
   copy .env.example .env
   ```

   On Windows (PowerShell):
   ```powershell
   Copy-Item .env.example .env
   ```

2. Open the `.env` file in your preferred text editor and update the values:

   ```env
   # Application Server Port
   PORT=5000

   # Node Environment
   NODE_ENV=development

   # Supabase Credentials
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
   SUPABASE_SECRET_KEY=your_supabase_service_role_key
   SUPABASE_KEY=your_supabase_service_role_key
   SUPABASE_JWKS_URL=https://your-project-id.supabase.co/auth/v1/.well-known/jwks.json

   # JWT Authentication Secrets
   JWT_SECRET=your_secure_custom_jwt_secret_string_here
   JWT_EXPIRES_IN=7d
   ```

   Key descriptions:
   - `PORT`: Network port on which the Express server listens (default: 5000).
   - `NODE_ENV`: Runtime environment (`development` or `production`).
   - `SUPABASE_URL`: The unique URL of your Supabase instance.
   - `SUPABASE_KEY` / `SUPABASE_SECRET_KEY`: Supabase API key for authenticating backend requests.
   - `JWT_SECRET`: Secret key used for signing and verifying JSON Web Tokens.
   - `JWT_EXPIRES_IN`: Lifespan duration of issued JWT tokens (e.g., `7d` for 7 days).

### Step 5: Run the Server

Choose the appropriate command based on your current task:

#### Development Mode (with native watch mode)
In development, the server reloads automatically upon any source code modification:
```bash
npm run dev
```

#### Production Mode
To launch the server without file watchers:
```bash
npm start
```

### Step 6: Verify Installation

Upon launching the server, you will observe the following terminal log:

```text
=================================================
Server running on http://localhost:5000
Swagger UI docs: http://localhost:5000/api-docs
=================================================
```

You can test connectivity by visiting:
- Server Root: [http://localhost:5000](http://localhost:5000)
- Health Check: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- Swagger UI Documentation: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## API Documentation and Swagger UI

An interactive OpenAPI / Swagger UI dashboard is packaged with the application.

1. Open your browser and navigate to:
   ```text
   http://localhost:5000/api-docs
   ```
2. The UI lists all endpoints categorized under **Authentication**, **Categories**, and **Products**.
3. **To authorize protected routes**:
   - Call the `POST /api/auth/login` endpoint using the interactive interface or external client.
   - Copy the value of the `token` field from the response `data` object.
   - Click the **Authorize** button located in the top-right corner of Swagger UI.
   - Enter your token into the input field and click **Authorize**.
   - All subsequent requests executed via the Swagger UI will automatically include the `Authorization: Bearer <token>` header.

---

## Standardized API Response Format

All responses generated by this API adhere to a consistent contract provided by the `ApiResponse` utility class:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation description",
  "data": null,
  "error": null,
  "timestamp": "2026-11-04T00:00:00.000Z"
}
```

Field Specifications:
- `success` (boolean): Indicates whether the operation succeeded (`true`) or failed (`false`).
- `statusCode` (integer): Mirrors the corresponding HTTP status code (e.g., 200, 201, 400, 401, 404, 500).
- `message` (string): Human-readable summary of the outcome.
- `data` (object | array | null): Result payload for successful queries. `null` on errors.
- `error` (string | object | null): Error details or validation messages when an operation fails. `null` on success.
- `timestamp` (string): ISO 8601 timestamp marking the moment the response was dispatched.

---

## API Endpoints Reference

### System and Health Endpoints

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/` | Welcome endpoint with discovery links | None |
| GET | `/api/health` | Service uptime and timestamp check | None |
| GET | `/api-docs` | Interactive Swagger UI documentation | None |
| GET | `/api-docs.json` | Raw OpenAPI 3.0 JSON specification | None |

### Authentication Endpoints

Base path: `/api/auth`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user account | None |
| POST | `/api/auth/login` | Authenticate credentials and retrieve JWT token | None |
| GET | `/api/auth/me` | Retrieve profile of the authenticated user | Bearer Token |

### Category Management Endpoints

Base path: `/api/categories`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/categories` | Retrieve all categories | None |
| GET | `/api/categories/:uid` | Retrieve a single category by UID | None |
| POST | `/api/categories` | Create a new category | Bearer Token |
| PUT | `/api/categories/:uid` | Update an existing category by UID | Bearer Token |
| DELETE | `/api/categories/:uid` | Delete a category by UID | Bearer Token |

### Product Management Endpoints

Base path: `/api/products`

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/products` | Retrieve all products (supports query filters) | None |
| GET | `/api/products/:uid` | Retrieve a single product by UID (includes category data) | None |
| POST | `/api/products` | Create a new product | Bearer Token |
| PUT | `/api/products/:uid` | Update an existing product by UID | Bearer Token |
| DELETE | `/api/products/:uid` | Delete a product by UID | Bearer Token |

#### Product Filtering Query Parameters:
- `?search=<term>`: Case-insensitive search on product name.
- `?category_uid=<uid>`: Filters products belonging to a specific category UID.

---

## Sample Requests and Payloads

### 1. User Registration

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "developer@example.com",
    "password": "SecurePassword123",
    "name": "Jane Developer"
  }
  ```

### 2. User Login

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "developer@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Login successful",
    "data": {
      "user": {
        "uid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "email": "developer@example.com",
        "name": "Jane Developer"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "error": null,
    "timestamp": "2026-11-04T01:00:00.000Z"
  }
  ```

### 3. Create a Category

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/categories`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <your-jwt-token>`
- **Body**:
  ```json
  {
    "name": "Audio Equipment",
    "description": "Headphones, wireless earbuds, and professional studio monitors"
  }
  ```

### 4. Create a Product

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/products`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <your-jwt-token>`
- **Body**:
  ```json
  {
    "name": "Sony WH-1000XM5 Wireless Headphones",
    "price": 399.99,
    "quantity": 25,
    "description": "Industry Leading Noise Canceling Wireless Headphones",
    "category_uid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
  ```
  *(Note: The field `contaty` can also be passed instead of `quantity`)*

- **Response**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Product created successfully",
    "data": {
      "uid": "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
      "name": "Sony WH-1000XM5 Wireless Headphones",
      "price": 399.99,
      "quantity": 25,
      "description": "Industry Leading Noise Canceling Wireless Headphones",
      "category_uid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "category": {
        "uid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Audio Equipment",
        "description": "Headphones, wireless earbuds, and professional studio monitors"
      },
      "created_at": "2026-11-04T01:10:00.000Z",
      "updated_at": "2026-11-04T01:10:00.000Z"
    },
    "error": null,
    "timestamp": "2026-11-04T01:10:00.025Z"
  }
  ```

---

## Error Handling and HTTP Status Codes

The application employs uniform error handling returning standard HTTP status codes:

| HTTP Status Code | Scenario | Sample Message |
|---|---|---|
| 200 OK | Operation completed successfully | Operation successful |
| 201 Created | Resource created successfully | Product created successfully |
| 400 Bad Request | Missing or invalid required fields | Product name is required |
| 401 Unauthorized | Missing, expired, or invalid JWT token | Access denied. No token provided. |
| 403 Forbidden | Valid token but forbidden operation | Access forbidden |
| 404 Not Found | Resource or route does not exist | Route GET /api/unknown not found |
| 409 Conflict | Duplicate unique key violated | Category with this name already exists |
| 500 Internal Error | Unhandled server or database exception | Internal Server Error |

---

## License and Contribution

This project is licensed under the ISC License. Contributions, pull requests, and feedback are welcome.
