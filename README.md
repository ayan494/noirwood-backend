# Noirwood Backend API

This is the production-ready Node.js backend for Noirwood.

## Features
- **Independent Architecture**: Fully separated from the Next.js frontend.
- **TypeScript**: 100% type-safe.
- **Express.js & MongoDB**: RESTful architecture.
- **JWT Authentication**: Secured Admin routes.
- **Security**: Helmet, CORS, Morgan, Express Rate Limit.
- **Local File Uploads**: Multer configured for `/uploads`.
- **Email Notifications**: Nodemailer integrated for inquiries and contacts.

## Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017/noirwood`)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/noirwood
   JWT_SECRET=supersecretkey_change_me_in_production
   JWT_EXPIRES_IN=7d
   EMAIL_USER=noirwood@gmail.com
   EMAIL_PASS=your_app_password_here
   CLIENT_URL=http://localhost:3000
   ```

3. **Run in Development Mode**
   ```bash
   npm run dev
   ```

4. **Build and Run in Production**
   ```bash
   npm run build
   npm start
   ```

## Seeded Admin User
Upon the first run, the default admin is automatically seeded into the database:
- **Email**: `admin@noirwood.com`
- **Password**: `Admin@123`

## API Documentation
Once the server is running, you can access the Swagger UI documentation at:
**[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

## API Collection
A Postman/Bruno collection is provided in `Noirwood_API_Collection.json` for testing all endpoints.
