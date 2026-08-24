# Service Management API

A comprehensive service management system built with Express.js, featuring role-based access control, email verification, and OTP authentication.

## 📋 Project Overview

Service Management is a backend API designed to handle multiple user roles including administrators, officers, workers, and regular users. The system provides secure authentication, service management, and role-based access control.

## 🛠️ Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5.2.1
- **Database**: PostgreSQL 17.4
- **ORM**: Drizzle ORM 0.45.1
- **Authentication**: 
  - JWT (JSON Web Tokens)
  - Argon2 password hashing
  - Email verification with OTP
- **Email Service**: Nodemailer 8.0.1
- **Database Management**: Docker & Docker Compose

## 📦 Dependencies

### Production
- `express` - Web framework
- `drizzle-orm` - ORM for database operations
- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT token generation and verification
- `argon2` - Password hashing
- `nodemailer` - Email service
- `dotenv` - Environment variable management
- `cookie-parser` - Cookie parsing middleware

### Development
- `drizzle-kit` - Database migration tool
- `@types/express` - TypeScript types for Express
- `@types/node` - TypeScript types for Node.js
- `@types/pg` - TypeScript types for PostgreSQL

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Raamsrupesh/Service-Management
   cd Service\ Management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://Raamanand:SR@localhost:5432/servicesdb
   JWT_SECRET=your_jwt_secret_key
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   ```

4. **Start PostgreSQL Database**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npm run p
   ```

6. **Start the server**
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run r
   ```

The server will be available at `http://localhost:3000/`

## 📚 API Routes

### Authentication Routes (`/api/auth/v1`)
- `POST /register` - Register a new user
- `POST /verify-email` - Verify email with OTP
- `POST /login` - Login for all user categories (users, officers, workers)
- `POST /resend-otp` - Resend OTP for email verification

### User Routes (`/api/user/v1`)
- User-specific endpoints and operations

### Officer Routes (`/api/officer/v1`)
- Officer-specific endpoints and operations

### Worker Routes (`/api/worker/v1`)
- Worker-specific endpoints and operations

### Admin Routes (`/api/admin/v1`)
- Administrative endpoints and operations

## 📁 Project Structure

```
├── src/
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   ├── db.js             # Database configuration
│   │   └── autodelete.js     # Auto-delete configuration
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── officer.controller.js
│   │   ├── worker.controller.js
│   │   └── admin.controller.js
│   ├── middlewares/          # Express middlewares
│   │   ├── auth.middle.js
│   │   ├── admin.middle.js
│   │   ├── officer.mid.js
│   │   └── worker.middle.js
│   ├── models/               # Database models
│   │   ├── allmodels.js
│   │   ├── user.model.js
│   │   ├── officer.model.js
│   │   ├── worker.model.js
│   │   ├── services.model.js
│   │   └── otp.model.js
│   ├── routes/               # API routes
│   │   ├── auth.router.js
│   │   ├── user.router.js
│   │   ├── officer.routes.js
│   │   ├── worker.router.js
│   │   └── admin.router.js
│   ├── services/             # Business logic services
│   │   └── email.service.js
│   └── utils/                # Utility functions
│       └── emailcheck.js
├── drizzle/                  # Database migrations
├── docker-compose.yml        # Docker configuration
├── drizzle.config.js         # Drizzle ORM configuration
├── index.js                  # Entry point
├── package.json              # Project dependencies
└── README.md                 # This file
```

## 🔐 Security Features

- **Password Hashing**: Argon2 for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Email Verification**: OTP-based email verification
- **Role-Based Access Control**: Separate middleware for different user roles
- **Cookie-based Sessions**: Secure cookie handling

## 📝 Available Scripts

- `npm start` - Start the server
- `npm run r` - Start the server with auto-reload (watch mode)
- `npm run p` - Push database schema using Drizzle Kit
- `npm run s` - Open Drizzle Studio for database management

## 🗄️ Database

The application uses PostgreSQL with Drizzle ORM for database management.

### Docker Setup
The project includes a `docker-compose.yml` that sets up a PostgreSQL container:
- **Image**: PostgreSQL 17.4
- **Port**: 5432
- **Database**: servicesdb
- **Default Credentials**: 
  - Username: Raamanand
  - Password: SR

## 📧 Email Service

The application uses Nodemailer for sending emails, including OTP verification messages. Configure your email service credentials in the `.env` file.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👤 Author

Created as a service management solution for efficient user and service administration.

## 📞 Support

For issues and questions, please create an issue in the repository or contact the development team.

---

**Note**: This is a backend API project. Frontend integration is required for a complete application experience.
