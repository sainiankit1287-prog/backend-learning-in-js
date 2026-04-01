# Chai And Backend

A comprehensive Node.js + Express backend API for a video-sharing platform, featuring user authentication, JWT-based security, file uploads with Cloudinary, and video management using MongoDB.

> This project serves as a robust backend starter/boilerplate for building scalable video-sharing applications with secure authentication, media handling, database integration, and modern best practices.

---

## ✨ Features

- **User Authentication**: Secure JWT-based authentication with access and refresh tokens
- **Password Security**: Bcrypt-based password hashing and verification
- **File Upload Management**: Integration with Cloudinary for media file management
- **Video Management**: Full CRUD operations for video content with advanced search, filtering, and pagination
- **Video Metadata**: Track views, duration, and creator information
- **Comments System**: Users can comment on videos with proper ownership tracking
- **Likes Feature**: Like videos, comments, and tweets with relationship management
- **Playlists**: Create and manage custom video playlists
- **Tweets/Short Posts**: Activity feed with tweet-like functionality
- **User Subscriptions**: Support for user subscription tracking and management
- **Middleware**: Custom authentication and file upload (Multer) middleware with size limits
- **Error Handling**: Centralized API error handling and consistent response formats
- **CORS Support**: Configured for cross-origin requests
- **Environment Configuration**: Flexible environment-based configuration
- **Advanced Querying**: MongoDB aggregation pipelines for optimal performance

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

## 📚 API Endpoints

### Video Routes (`/videos`)
All video routes require JWT authentication.

- **GET** `/videos/get-All-Video` - Fetch all videos with advanced filtering & pagination
  - Query Parameters:
    - `page` (int, default: 1) - Page number
    - `limit` (int, default: 10, max: 30) - Items per page
    - `query` (string) - Search videos by title (case-insensitive)
    - `sortBy` (string) - Sort field: `createdAt`, `views`, `duration`, or `title`
    - `sortType` (string) - Sort order: `asc` or `desc`
    - `userId` (ObjectId) - Filter videos by owner

- **POST** `/videos/publish-A-video` - Upload and publish a new video
  - Body: `multipart/form-data`
    - `title` (string, required) - Video title
    - `description` (string, required) - Video description
    - `videoFile` (file, required) - Video file (max 1GB)
  - Response: Returns video URL and metadata after successful upload

### User Routes (`/users`)
- User registration, login, and profile management

---

## 🗄️ Database Models

### Video Model
```javascript
{
  videoFile: String (Cloudinary URL),
  title: String,
  description: String,
  duration: Number,
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  owner: ObjectId (Reference to User),
  timestamps: true
}
```

### Comment Model
```javascript
{
  content: String,
  video: ObjectId (Reference to Video),
  owner: ObjectId (Reference to User),
  timestamps: true
}
```

### Likes Model
```javascript
{
  comment: ObjectId (Reference to Comment),
  video: ObjectId (Reference to Video),
  tweet: ObjectId (Reference to Tweet),
  likedBy: ObjectId (Reference to User),
  timestamps: true
}
```

### Playlist Model
```javascript
{
  name: String,
  description: String,
  videos: [ObjectId] (Array of Video references),
  owner: ObjectId (Reference to User),
  timestamps: true
}
```

### Tweet Model
```javascript
{
  content: String,
  owner: ObjectId (Reference to User),
  timestamps: true
}
```

---


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

---

## 📦 Dependencies

- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Cloud file storage and management
- **Multer** - File upload middleware
- **Cookie Parser** - Cookie parsing middleware
- **CORS** - Cross-Origin Resource Sharing
- **Nodemon** - Development server auto-reload

---

## 🛠 Available Scripts

```bash
# Start development server with auto-reload
npm run dev
```

---

## 👨‍💻 Author

Ankit

---

## 📝 License

ISC
```

---

## 📁 Project Structure

```
chai-and-backend/
├── public/
│   └── temp/                    # Temporary file storage
├── src/
│   ├── app.js                   # Main Express application setup
│   ├── constants.js             # Application constants
│   ├── index.js                 # Server entry point
│   ├── controllers/
│   │   └── user.controller.js   # User-related operations (register, login, profile)
│   ├── db/
│   │   └── index.js             # MongoDB connection setup
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT authentication middleware
│   │   └── multer.middleware.js # File upload handling
│   ├── models/
│   │   ├── subscription.model.js # Subscription schema
│   │   ├── user.model.js        # User schema with authentication
│   │   └── video.model.js       # Video content schema
│   ├── routes/
│   │   └── user.routes.js       # User-related API routes
│   └── utils/
│       ├── ApiError.js          # Custom error class for API responses
│       ├── ApiResponse.js       # Standardized API response format
│       ├── asyncHandler.js      # Wrapper for async route handlers
│       ├── cloudinary.js        # Cloudinary integration for uploads
│       └── deleteFromCloudinary.js # Utility to delete Cloudinary files
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

---

## 🔧 Features

- **User Authentication**: JWT-based authentication with access and refresh tokens
- **File Uploads**: Avatar and video uploads using Multer and Cloudinary
- **Video Management**: Complete video upload, storage, and management system
- **User Profiles**: Channel profiles, watch history, and user management
- **Subscriptions**: User subscription system for channel relationships
- **Error Handling**: Comprehensive error handling with custom error classes
- **CORS Support**: Configurable CORS for frontend integration
- **Database Integration**: MongoDB with Mongoose ODM

---

## 📡 API Endpoints

### User Routes (`/api/v1/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | User login |
| POST | `/logout` | User logout |
| POST | `/refresh-token` | Refresh access token |
| POST | `/change-password` | Change user password |
| GET | `/current-user` | Get current user profile |
| PATCH | `/update-account` | Update account details |
| PATCH | `/update-avatar` | Update user avatar |
| PATCH | `/update-cover-image` | Update cover image |
| GET | `/c/:username` | Get user channel profile |
| GET | `/watch-history` | Get user watch history |

---

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **File Uploads**: Multer
- **Environment**: dotenv
- **Security**: bcrypt for password hashing
- **Validation**: Custom validation middleware

---

## 🚀 Deployment

1. Set up your production environment variables
2. Ensure MongoDB is running and accessible
3. Configure Cloudinary credentials
4. Run `npm start` for production

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email support@example.com or join our Discord channel.
```

> **Note:** Ensure all environment variables are properly set before running the application.

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

**Ankit** - Backend learner

---

*Built with ❤️ using Node.js, Express, and MongoDB*
