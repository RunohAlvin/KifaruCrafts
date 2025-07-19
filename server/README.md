# KifaruCrafts Server

Backend API server for the KifaruCrafts e-commerce platform built with Express.js, TypeScript, and Mongoose.

## Features

- **Express.js** server with TypeScript
- **Mongoose** for MongoDB integration
- **Session-based authentication**
- **Zod** for request validation
- **CORS** configuration for frontend integration
- **Environment-based configuration**
- **RESTful API** architecture

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── environment.ts     # Environment configuration and validation
│   ├── db/
│   │   └── dbconnect.ts       # MongoDB connection setup
│   ├── models/
│   │   ├── Cart.ts            # Cart model
│   │   ├── Category.ts        # Category model
│   │   ├── Product.ts         # Product model
│   │   └── User.ts            # User model
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes
│   │   ├── cart.ts            # Cart management routes
│   │   ├── categories.ts      # Category routes
│   │   ├── products.ts        # Product routes
│   │   └── vendors.ts         # Vendor routes
│   ├── types/
│   │   └── session.d.ts       # Session type extensions
│   └── server.ts              # Main server application
├── index.ts                   # Entry point
├── package.json
├── tsconfig.json
└── .env.example               # Environment variables template
```

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure the following variables:

   - `MONGODB_URI`: Your MongoDB connection string
   - `SESSION_SECRET`: A secure secret for session management
   - `PORT`: Server port (default: 5000)
   - `NODE_ENV`: Environment (development/production)

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (vendor only)
- `PUT /api/products/:id` - Update product (vendor only)
- `DELETE /api/products/:id` - Delete product (vendor only)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Vendors

- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get single vendor
- `PUT /api/vendors/:id` - Update vendor profile

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run type-check` - Run TypeScript type checking

### Database

The application uses MongoDB with Mongoose ODM. Ensure you have MongoDB running and configured in your `.env` file.

### Authentication

The server uses session-based authentication with express-session. Sessions are stored in memory by default (consider using a persistent store for production).

### Validation

Request validation is handled by Zod schemas. All API endpoints validate incoming data and return appropriate error messages.

## Best Practices Implemented

1. **Environment Configuration**: Centralized environment variable management with validation
2. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
3. **Input Validation**: Request validation using Zod schemas
4. **Database Connection**: Robust MongoDB connection with reconnection logic
5. **Security**: Session-based authentication with secure cookie configuration
6. **Code Organization**: Clean separation of concerns with modular route handlers
7. **TypeScript**: Full TypeScript implementation for type safety

## Production Considerations

1. **Environment Variables**: Ensure all production environment variables are set
2. **Session Store**: Use a persistent session store (Redis, MongoDB, etc.)
3. **HTTPS**: Enable HTTPS in production
4. **Rate Limiting**: Consider implementing rate limiting for API endpoints
5. **Monitoring**: Add application monitoring and logging
6. **Database**: Use MongoDB Atlas or a managed MongoDB service
