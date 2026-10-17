# ITELECT4 Project — Backend API

The REST API server for the ITELECT4 course submission portal. Built with Express and TypeScript, connected to MongoDB Atlas, and deployed as a serverless function on Vercel. Handles authentication (JWT), course data, and student submissions.

---

## 🚀 Live URLs

| Service  | URL |
|----------|-----|
| **Backend API** | [https://itelect4-project-backend.vercel.app](https://itelect4-project-backend.vercel.app) |
| **Frontend** | [https://itelect4-project-wheat.vercel.app](https://itelect4-project-wheat.vercel.app) |

---

## 🛠 Technologies Used

| Category | Technology |
|----------|-----------|
| Runtime | Node.js |
| Framework | Express v5 |
| Language | TypeScript |
| Database | MongoDB Atlas via Mongoose |
| Authentication | JSON Web Tokens (jsonwebtoken) |
| Password Hashing | bcryptjs |
| CORS | cors middleware |
| Environment | dotenv |
| Dev Server | tsx (watch mode) |
| Deployment | Vercel (serverless) |

---

## 📁 Project Structure

```
src/
├── app.ts              # Express app — CORS, middleware, routes (Vercel entry point)
├── server.ts           # Local dev server (listens on PORT)
├── seed.ts             # Database seed script (upserts reference courses)
├── config/
│   └── db.ts           # MongoDB connection with promise caching for serverless
├── controllers/        # Route handler logic
├── data/
│   └── courses.ts      # Reference course data
├── middleware/         # Auth middleware (JWT verification)
├── models/
│   ├── Course.ts       # Mongoose Course schema & model
│   └── ...             # Other Mongoose models
├── routes/
│   ├── authRoutes.ts   # POST /api/auth/register, POST /api/auth/login
│   ├── courses.ts      # GET /api/courses, GET /api/courses/:code
│   └── submissionRoutes.ts  # GET/POST /api/submissions
└── types/              # Shared TypeScript types
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier is sufficient)

### 1. Clone the repository

```bash
git clone <your-backend-repo-url>
cd itelect4-project-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:5173,https://itelect4-project-wheat.vercel.app
```

| Variable | Description |
|----------|-------------|
| `PORT` | Local port for the dev server (default: `5000`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CORS_ORIGIN` | Comma-separated list of allowed origins |

### 4. Run the development server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 5. Seed the database

Populate the database with reference course data:

```bash
npm run seed
```

### 6. Build for production

```bash
npm run build
```

---

## 📡 API Endpoints

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/` | ❌ | Root health check |
| `GET` | `/api/health` | ❌ | Health check with DB status |

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Log in and receive JWT |

**Register / Login request body:**

```json
{
  "email": "student@example.com",
  "password": "yourpassword"
}
```

**Login response:**

```json
{
  "token": "<jwt_token>",
  "user": { "id": "...", "email": "..." }
}
```

### Courses (Public)

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/courses` | ❌ | List all courses |
| `GET` | `/api/courses/:code` | ❌ | Get a course by its code |

### Submissions (Protected)

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/submissions` | ✅ | Get current user's submissions |
| `POST` | `/api/submissions` | ✅ | Submit a course |

Protected routes require a `Authorization: Bearer <token>` header.

---

## 🌐 Deployment (Vercel)

The backend is deployed on **Vercel** as a serverless function via `vercel.json`. The entry point is `src/app.ts`, which exports the Express `app` as default — no separate HTTP listener is needed on Vercel.

**Environment variables required on Vercel:**

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your JWT signing secret |
| `CORS_ORIGIN` | `https://itelect4-project-wheat.vercel.app` |

> **Security:** Never commit your `.env` file. It is excluded via `.gitignore`. Always set secrets through the Vercel dashboard.
