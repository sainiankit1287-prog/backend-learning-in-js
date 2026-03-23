# Chai And Backend

A comprehensive Node.js + Express backend API for a video-sharing platform, featuring user authentication, file uploads, and video management using MongoDB and Cloudinary.

> This project serves as a robust backend starter/boilerplate for building scalable video-sharing applications with secure authentication, media handling, and database integration.

---

## 🚀 Quick Start

```bash
# 1) Clone the repository
git clone <repository-url>
cd chai-and-backend

# 2) Install dependencies
npm install

# 3) Create a .env file (see Environment Variables section)
# 4) Start development server
npm run dev
```

The server runs on `http://localhost:8000` by default (configurable via `PORT` in `.env`).

---

## 🧩 Environment Variables

Create a `.env` file at the project root with the following variables:

```env
# Server Configuration
PORT=8000
CORS_ORIGIN=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017
DB_NAME=backend_learning

# JWT Token Configuration
ACCESS_TOKEN_SECRET=your_long_access_token_secret_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_long_refresh_token_secret_here
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Note:** Ensure all environment variables are properly set before running the application.

---

## 🗂 Project Structure

```
chai-and-backend/
├── .env                        # Environment variables (create this file)
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier code formatting configuration
├── .prettierignore             # Files to ignore for Prettier formatting
├── package.json                # Dependencies and scripts
├── package-lock.json           # Lockfile for exact dependency versions
├── README.md                   # Project documentation
├── public/
│   └── temp/                    # Temporary file storage for uploads
├── src/
│   ├── app.js                  # Express app configuration and middleware setup
│   ├── constants.js            # Application constants (DB_NAME)
│   ├── index.js                # Application entry point
│   ├── controllers/
│   │   └── user.controller.js  # User-related business logic
│   ├── db/
│   │   └── index.js            # MongoDB connection setup
│   ├── middlewares/
│   │   └── multer.middleware.js # File upload middleware configuration
│   ├── models/
│   │   ├── user.model.js       # User schema with authentication methods
│   │   └── video.model.js      # Video schema with pagination support
│   ├── routes/
│   │   └── user.routes.js      # User API routes
│   └── utils/
│       ├── ApiError.js         # Custom error handling class
│       ├── ApiResponse.js      # Standardized API response class
│       ├── asyncHandler.js     # Async route handler wrapper
│       └── cloudinary.js       # Cloudinary file upload utility
└── node_modules/               # Installed dependencies (auto-generated)
```

---

## ✅ Features

### 🔐 Authentication & Security
- User registration with secure password hashing (bcrypt)
- JWT-based authentication (Access & Refresh tokens)
- Password validation and user existence checks
- Secure file upload handling

### 📁 File Management
- Multi-file upload support (avatar, cover image)
- Cloudinary integration for media storage
- Automatic local file cleanup after upload
- File type validation and size limits

### 🎥 Video Platform Features
- Video upload and storage
- Thumbnail management
- Video metadata (title, description, duration, views)
- User watch history tracking
- Video publishing controls

### 🛠 Developer Experience
- ES6+ modules support
- Async/await error handling wrapper
- Standardized API responses
- MongoDB aggregation with pagination
- CORS configuration
- Cookie parsing
- Development server with auto-reload (nodemon)

### 📊 Database
- MongoDB with Mongoose ODM
- Schema validation and indexing
- Reference relationships (User-Video)
- Timestamps and data integrity

---

## 📡 API Endpoints

### User Routes
- `POST /users/register` - Register a new user
  - **Body:** `fullName`, `email`, `username`, `password`
  - **Files:** `avatar` (required), `coverImage` (optional)
  - **Response:** User data (excluding password and refresh token)

> **Note:** More endpoints (login, profile, etc.) can be added following the same pattern.

---

## 🛠 Tech Stack

### Backend Framework
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for API development

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Authentication & Security
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT token generation and verification

### File Handling
- **multer** - Middleware for handling file uploads
- **cloudinary** - Cloud storage for media files

### Utilities
- **cors** - Cross-origin resource sharing
- **cookie-parser** - Cookie handling middleware
- **dotenv** - Environment variable management

### Development Tools
- **nodemon** - Development server with auto-reload
- **prettier** - Code formatting

---

## 🚀 Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server with nodemon |

---

## 🔧 Configuration Details

### Express App Setup (`app.js`)
- CORS configuration with credentials support
- JSON and URL-encoded body parsing (16kb limit)
- Static file serving from `public` directory
- Cookie parsing middleware
- Route mounting for user endpoints

### Database Connection (`db/index.js`)
- MongoDB connection with error handling
- Graceful connection logging
- Process exit on connection failure

### File Upload (`multer.middleware.js`)
- Disk storage in `public/temp`
- Original filename preservation
- Configurable for multiple file fields

### Cloudinary Integration (`cloudinary.js`)
- Automatic file upload to Cloudinary
- Local file cleanup after successful upload
- Error handling for failed uploads

### Authentication (`user.model.js`)
- Pre-save password hashing middleware
- Password comparison method
- JWT token generation methods (access & refresh)

---

## 📝 Development Notes

### Error Handling
- Custom `ApiError` class for consistent error responses
- `ApiResponse` class for standardized success responses
- `asyncHandler` wrapper for async route error catching

### Security Considerations
- Passwords are hashed before storage
- JWT tokens for stateless authentication
- File upload validation
- CORS restrictions

### TODO / Future Enhancements
- Add login endpoint and authentication middleware
- Implement video upload and management endpoints
- Add user profile update functionality
- Implement watch history and recommendations
- Add API versioning (`/api/v1/`)
- Add input validation middleware
- Implement rate limiting
- Add comprehensive error logging

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is released under the ISC License.

---

## 👨‍💻 Author

**Ankit** - Backend learning

---

*Built with ❤️ using Node.js, Express, and MongoDB*
