# Chai And Backend

A simple Node.js + Express backend starter project using MongoDB (Mongoose).

> This project is structured as a learning/boilerplate repo for building a backend API with user authentication, video uploading (model), and common utility patterns.

---

## 🚀 Quick Start

```bash
# 1) Install dependencies
npm install

# 2) Create a .env file (see the example below)
# 3) Start development server
npm run dev
```

The server runs on `http://localhost:8000` by default (or the value of `PORT` in your `.env`).

---

## 🧩 Environment Variables

Create a `.env` file at the project root (next to `package.json`) with values like:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=backend_learning
CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_long_secret_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECERT=your_long_secret_here
REFRESH_TOKEN_EXPIRY=7d
```

> 🔎 Note: The project currently uses `REFRESH_TOKEN_SECERT` (typo) in the code, so keep that variable name for compatibility.

---

## 🗂 Folder Structure

- `src/`
  - `app.js` - Express app configuration (middleware, static, CORS)
  - `index.js` - Entry point that loads env vars, connects to MongoDB, and starts the server
  - `db/` - MongoDB connection helper
  - `models/` - Mongoose models (`User`, `Video`)
  - `utils/` - Helper classes (`ApiError`, `ApiResponse`, `asyncHandler`)

---

## ✅ Features Included

- Express server with CORS and JSON parsing
- MongoDB connection using Mongoose
- `User` model with password hashing, JWT token generation
- `Video` model with pagination plugin (mongoose-aggregate-paginate-v2)
- Utility classes for standard API response formatting and error handling

---

## 🛠 Common Commands

| Command | Description |
|--------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start server with nodemon |

---

## 🔧 Notes / TODO

- There are currently no route/controller implementations; you can add them under `src/routes/` and `src/controllers/`.
- The `asyncHandler` helper in `src/utils/asyncHandler.js` has an issue and likely should be refactored (see comment inside file).

---

## 📌 Licensing

This project is released under the ISC License.
