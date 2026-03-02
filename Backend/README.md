# 🚀 NextGen B2B E-Commerce & Catalog SaaS - Backend

A scalable, multi-tenant B2B e-commerce platform backend built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### Current Features
- ✅ **Multi-Tenant Architecture** - Isolated data per vendor
- ✅ **Authentication & Authorization** - JWT-based with RBAC
- ✅ **Product Management** - CRUD operations with variants, images, pricing
- ✅ **Catalog System** - Shareable catalogs with QR codes
- ✅ **Order Management** - Complete order lifecycle tracking
- ✅ **Inventory Tracking** - Real-time stock management
- ✅ **Payment Integration** - Razorpay payment gateway
- ✅ **Invoice Generation** - PDF invoice creation
- ✅ **AI-Powered Features** - Product description generation
- ✅ **Analytics Dashboard** - Sales, orders, customer insights
- ✅ **Audit Logging** - Complete action tracking
- ✅ **Image Upload** - Cloudinary integration

### Upcoming Features
- 🔄 Real-time notifications (WebSocket)
- 🔄 Multi-channel integration (Amazon, Flipkart, Shopify)
- 🔄 Advanced AI features (recommendations, forecasting)
- 🔄 Email/SMS marketing campaigns
- 🔄 Multi-language support
- 🔄 GraphQL API
- 🔄 Redis caching
- 🔄 Elasticsearch integration

## 🛠 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 5.x
- **Database:** MongoDB 6+
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Cloudinary
- **Payment:** Razorpay
- **PDF Generation:** PDFKit
- **AI:** OpenAI API
- **Notifications:** Twilio (WhatsApp, SMS)
- **Security:** Helmet, bcryptjs, express-rate-limit

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** for version control

### Optional Services (for full functionality)
- **Cloudinary Account** - [Sign Up](https://cloudinary.com/)
- **Razorpay Account** - [Sign Up](https://razorpay.com/)
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/)
- **Twilio Account** - [Sign Up](https://www.twilio.com/)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration (see [Environment Setup](#environment-setup))

4. **Ensure MongoDB is running**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env with your Atlas connection string
```

## ⚙️ Environment Setup

Create a `.env` file in the Backend directory with the following variables:

### Required Variables
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/nextgen-b2b
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
```

### Optional but Recommended
```env
# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OpenAI (for AI features)
OPENAI_API_KEY=sk-xxx

# Razorpay (for payments)
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your-secret

# Twilio (for SMS/WhatsApp)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Server will start on `http://localhost:5000` with hot-reload enabled.

### Production Mode
```bash
npm start
```

### Database Seeding (Optional)
```bash
npm run seed
```
This will populate the database with sample data for testing.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "phone": "1234567890",
  "role": "vendor",
  "businessName": "My Business"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}

Response:
{
  "success": true,
  "token": "jwt-token-here",
  "user": { ... }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

### Products Endpoints

#### Create Product
```http
POST /products
Authorization: Bearer {token}
x-tenant-id: {tenantId}
Content-Type: application/json

{
  "name": "Product Name",
  "sku": "SKU-12345",
  "price": 999,
  "category": "Electronics",
  "description": "Product description",
  "stock": 100
}
```

#### Get All Products
```http
GET /products?page=1&limit=10&search=laptop&status=active
Authorization: Bearer {token}
x-tenant-id: {tenantId}
```

#### Update Product
```http
PUT /products/{id}
Authorization: Bearer {token}
x-tenant-id: {tenantId}
```

#### Delete Product
```http
DELETE /products/{id}
Authorization: Bearer {token}
x-tenant-id: {tenantId}
```

### Catalog Endpoints

#### Create Catalog
```http
POST /catalogs
Authorization: Bearer {token}
x-tenant-id: {tenantId}

{
  "name": "Summer Collection",
  "description": "Our best summer products",
  "products": [
    { "product": "productId1", "order": 1 },
    { "product": "productId2", "order": 2 }
  ],
  "template": "grid",
  "status": "published"
}
```

#### Get Public Catalog (No Auth Required)
```http
GET /catalogs/public/{shareableLink}
```

### Order Endpoints

#### Create Order
```http
POST /orders
Authorization: Bearer {token}
x-tenant-id: {tenantId}

{
  "items": [
    {
      "product": "productId",
      "quantity": 2,
      "price": 999
    }
  ],
  "shippingAddress": { ... },
  "paymentMethod": "razorpay"
}
```

#### Get Orders
```http
GET /orders?status=pending&page=1&limit=10
Authorization: Bearer {token}
x-tenant-id: {tenantId}
```

### Analytics Endpoints

#### Dashboard Stats
```http
GET /analytics/dashboard
Authorization: Bearer {token}
x-tenant-id: {tenantId}
```

#### Sales Analytics
```http
GET /analytics/sales?period=30d
Authorization: Bearer {token}
x-tenant-id: {tenantId}
```

### Payment Endpoints

#### Get Razorpay Key
```http
GET /payments/razorpay/key
Authorization: Bearer {token}
```

#### Verify Payment
```http
POST /payments/razorpay/verify
Authorization: Bearer {token}

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

## 📁 Project Structure

```
Backend/
├── server.js                 # Application entry point
├── package.json              # Dependencies and scripts
├── nodemon.json              # Nodemon configuration
├── .env.example              # Environment variables template
└── src/
    ├── app.js                # Express app configuration
    ├── config/               # Configuration files
    │   ├── db.js             # MongoDB connection
    │   └── cloudinary.js     # Cloudinary setup
    ├── models/               # Mongoose models
    │   ├── User.js
    │   ├── Tenant.js
    │   ├── Product.js
    │   ├── Catalog.js
    │   ├── Order.js
    │   ├── Inventory.js
    │   ├── Review.js
    │   ├── AuditLog.js
    │   ├── Customer.js
    │   └── Subscription.js
    ├── controllers/          # Route controllers
    │   ├── authController.js
    │   ├── productController.js
    │   ├── catalogController.js
    │   ├── orderController.js
    │   ├── paymentController.js
    │   ├── analyticsController.js
    │   ├── aiController.js
    │   ├── invoiceController.js
    │   └── vendorController.js
    ├── routes/               # API routes
    │   ├── index.js          # Route aggregator
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   ├── catalogRoutes.js
    │   ├── orderRoutes.js
    │   ├── paymentRoutes.js
    │   ├── analyticsRoutes.js
    │   ├── aiRoutes.js
    │   ├── invoiceRoutes.js
    │   └── vendorRoutes.js
    ├── middleware/           # Custom middleware
    │   ├── auth.js           # Authentication
    │   ├── rbac.js           # Role-based access control
    │   ├── tenantResolver.js # Tenant isolation
    │   ├── errorHandler.js   # Global error handler
    │   ├── rateLimiter.js    # Rate limiting
    │   └── upload.js         # File upload handling
    ├── services/             # Business logic
    │   ├── aiService.js
    │   ├── invoiceService.js
    │   └── notificationService.js
    ├── utils/                # Utility functions
    │   ├── constants.js
    │   ├── helper.js
    │   ├── helpers.js
    │   └── logger.js
    ├── validators/           # Input validation schemas
    └── jobs/                 # Background jobs (future)
```

## 📜 Available Scripts

```bash
# Development with auto-reload
npm run dev

# Production
npm start

# Seed database with sample data
npm run seed

# Run tests (when implemented)
npm test

# Lint code (when configured)
npm run lint
```

## 🧪 Testing

Testing infrastructure to be implemented. Planned:
- Unit tests with Jest
- Integration tests with Supertest
- E2E tests with Cypress

## 🚢 Deployment

### Manual Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update `MONGO_URI` with production database
3. Set secure `JWT_SECRET`
4. Configure production `CLIENT_URL`
5. Run `npm start`

### Docker Deployment (Coming Soon)

```bash
docker build -t nextgen-backend .
docker run -p 5000:5000 --env-file .env nextgen-backend
```

### Cloud Platforms

**Recommended platforms:**
- Heroku
- AWS EC2 / ECS
- DigitalOcean App Platform
- Railway
- Render

**Database:**
- MongoDB Atlas (recommended)
- AWS DocumentDB
- Self-hosted MongoDB with replication

## 🔒 Security Best Practices

- ✅ JWT tokens with expiration
- ✅ Password hashing with bcrypt
- ✅ Rate limiting enabled
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Input validation
- ✅ MongoDB injection prevention
- ⏳ Implement 2FA (planned)
- ⏳ Add HTTPS in production
- ⏳ Environment variable encryption

## 🐛 Troubleshooting

### Cannot connect to MongoDB
```bash
# Make sure MongoDB is running
mongod

# Or check if MongoDB service is active
sudo systemctl status mongod
```

### Port already in use
```bash
# Change PORT in .env file
PORT=5001
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📧 Support

For support, email support@nextgen-b2b.com or create an issue in the repository.

## 🙏 Acknowledgments

- Express.js team
- MongoDB team
- All open-source contributors

---

**Built with ❤️ by the NextGen Team**
