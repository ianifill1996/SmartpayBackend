# SmartPay Backend

SmartPay is a secure, AI-assisted payment system backend built using the **MERN stack**. This repository contains the server-side logic for managing user authentication, payment tracking, AI-powered payment intent detection, and protected API endpoints. 

## Features

- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Role-based access control for routes
- CRUD operations for payments
- AI integration to categorize payment intents using OpenAI
- RESTful API structure (users, payments, AI)
- Express middleware for route protection
- MongoDB database with Mongoose schemas
- Modular structure with routes, controllers, and models

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Bcrypt
- OpenAI API (for AI intent detection)
- CORS and dotenv for environment configuration

## API Endpoints

### Auth Routes (`/api/users`)
- `POST /register` – Register a new user
- `POST /login` – Authenticate user and return token
- `GET /me` – Get current user profile (Protected)

### Payment Routes (`/api/payments`)
- `GET /` – Get all user payments (Protected)
- `POST /` – Create a new payment (Protected)
- `PUT /:id` – Update a specific payment (Protected)
- `DELETE /:id` – Delete a payment (Protected)

### AI Routes (`/api/ai`)
- `POST /intent` – Detect intent from payment description using OpenAI (Protected)

## Installation

1. **Clone the repository**
   
   git clone https://github.com/ianifill1996/SmartpayBackend.git
   cd SmartpayBackend

2. **Install dependencies
npm install

3. **Set up your .env file
Create a .env file in the root directory and add:
NODE_ENV=development
PORT=5001
MONGO_URI=your_mongo_db_connection
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key

4. **Start the server
npm run dev
The server should run on http://localhost:5001.

## Folder Structure

SmartpayBackend/
├── config/
│   └── db.js
├── controllers/
│   ├── aiController.js
│   ├── paymentController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── paymentModel.js
│   └── userModel.js
├── routes/
│   └── api/
│       ├── aiRoutes.js
│       ├── paymentRoutes.js
│       └── userRoutes.js
├── .env
├── server.js
└── package.json

## Deployment
You can deploy this backend using services such as Render, Railway, or Heroku. Be sure to update your environment variables in the hosting platform.

## Future Improvements
Admin dashboard for managing all users and transactions

Notification system for flagged or suspicious payments

GraphQL support

Rate limiting and brute-force protection
