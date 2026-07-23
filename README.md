Here's the README content:

---

# DevBlog Backend

A production-ready RESTful API backend for **DevBlog** — a blogging platform where developers share stories, ideas, and knowledge.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js 5 |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| Validation | Zod |
| Email | Nodemailer + Gmail SMTP |
| AI Summarization | Google Gemini API |
| Documentation | Swagger / OpenAPI 3.0 |
| Testing | Jest + ts-jest + Supertest |
| Linting | ESLint + Prettier |
| Git Hooks | Husky + lint-staged |

---

## Architecture

```
Request
  ↓
Middleware (validate, authenticate, authorize)
  ↓
Controller (parse request, call service, send response)
  ↓
Service (business logic, error handling, DTO mapping)
  ↓
Repository (database queries via Prisma)
  ↓
Database (PostgreSQL)
```

### Key Design Decisions

- **Controller → Service → Repository** layering — each layer has a single responsibility
- **DTOs** — input types derived from Zod schemas; output types as classes that control response shape
- **Custom error classes** — typed `AppError` hierarchy (`NotFoundError`, `ConflictError`, etc.) with `logging` and `isOperational` flags
- **Centralized error handling** — single `errorHandler` middleware catches all error types (AppError, Zod, Prisma, unexpected)
- **Stateless JWT** — no server-side token storage; 1 month expiry
- **UUID primary keys** — all entities use `@default(uuid())`
- **Soft delete** — users are never permanently removed; `isDeleted` flag used instead

---

## Project Structure

```
src/
├── common/
│   └── error/              # Custom error classes (AppError, NotFoundError, etc.)
├── config/
│   ├── prisma.ts           # Shared Prisma client instance
    ├── env.ts              # Environmet variable validator
│   └── swagger.ts          # Swagger/OpenAPI configuration
├── constants/
│   ├── messages.ts         # Centralized error/success messages
│   ├── statusCode.ts       # HTTP status code enum
│   └── schemaConstants.ts  # Validation constants (min/max lengths)
├── controllers/            # HTTP layer — parse req, call service, send res
├── docs/                   # Swagger JSDoc annotations per route group
├── dtos/                   # Data Transfer Objects (input/output shapes)
├── interfaces/             # TypeScript interfaces for repositories
├── mappers/                # Entity → DTO transformation functions (where needed)
├── middlewares/
│   ├── authenticate.ts     # JWT verification
│   ├── authorize.ts        # Role/ownership checks
│   ├── errorHandler.ts     # Global error handler
│   ├── notFound.ts         # 404 handler for unmatched routes
│   └── validate.ts         # Zod request validation
├── repositories/           # Database layer — Prisma queries only
├── routes/                 # Express routers
├── schemas/                # Zod validation schemas
├── services/               # Business logic layer
├── types/                  # TypeScript type declarations
├── utils/                  # Shared utilities (jwt, mailer, otp, logger, etc.)
├── app.ts                  # Express app setup
└── server.ts               # Server entry point + DB connection
prisma/
├── schema.prisma           # Database schema
├── migrations/             # Migration history
└── seed.ts                 # Database seeder
src/__tests__/              # Jest unit tests
```

---

## Database Schema

```
User ──────────────── Auth          (1:1)
User ──────────────── Story         (1:many)
Story ─────────────── StoryCategory (many:many via join table)
Category ──────────── StoryCategory (many:many via join table)
```

### Models

| Model | Key Fields |
|---|---|
| User | `id` (UUID), `username`, `name`, `email`, `role` (ADMIN/USER), `isDeleted`, `isVerified` |
| Auth | `userId` (FK+PK), `password` (hashed), `verificationToken`, `passwordChangeOtp` |
| Story | `storyId` (UUID), `userId` (FK), `title`, `body`, `summary` (AI), `createdAt`, `updatedAt` |
| Category | `id` (UUID), `name` (unique), `description` |
| StoryCategory | `storyId` + `categoryId` (composite PK) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Gmail account (for email features)
- Google Gemini API key (for AI summarization)

### Installation

```bash
git clone https://github.com/Noshin-03/dev-blog-backend.git
cd dev-blog-backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in the values:

```env
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dev_blog?schema=public"

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=10d

# Gmail SMTP (for email verification and password change OTP)
GMAIL_USER=your_gmail@gmail.com
MAIL_PASSWORD=your_16_char_app_password

# Frontend URL (used in email links)
CLIENT_URL=http://localhost:3000

# Google Gemini (for AI story summarization)
GEMINI_API_KEY=your_gemini_api_key
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed admin user and initial categories
npx prisma db seed
```

### Run

```bash
npm run dev        # Development with hot reload
npm run build      # Compile TypeScript
npm start          # Production
```

---

## API Documentation

Interactive Swagger docs available at:
```
http://localhost:5000/api-docs
```

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | — | Register new user, sends verification email |
| POST | `/auth/login` | — | Login, receive JWT token |
| GET | `/auth/verify-email?token=` | — | Verify email address |
| POST | `/auth/resend-verification` | — | Resend verification email |
| POST | `/auth/change-password` | ✅ | Initiate password change (sends OTP) |
| POST | `/auth/confirm-password-change` | ✅ | Confirm password change with OTP |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users` | ✅ Admin | Get all users (paginated, searchable) |
| GET | `/users/:userId` | ✅ | Get user by ID |
| PATCH | `/users/:userId` | ✅ Owner/Admin | Update user |
| DELETE | `/users/:userId` | ✅ Owner/Admin | Soft delete user |

### Profile
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users/profile` | ✅ | Get own profile |
| PATCH | `/users/profile` | ✅ | Update own profile (name, username, email) |

### Stories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/stories` | — | Get all stories (paginated, searchable, filterable) |
| POST | `/stories` | ✅ | Create story (optional AI summary) |
| GET | `/stories/:storyId` | — | Get story by ID |
| PATCH | `/stories/:storyId` | ✅ Owner/Admin | Update story |
| DELETE | `/stories/:storyId` | ✅ Owner/Admin | Delete story |
| POST | `/stories/:storyId/regenerate-summary` | ✅ Owner/Admin | Regenerate AI summary |

### Categories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/categories` | — | Get all categories |
| POST | `/categories` | ✅ Admin | Create category |
| GET | `/categories/:categoryId` | — | Get category by ID |
| PATCH | `/categories/:categoryId` | ✅ Admin | Update category |
| DELETE | `/categories/:categoryId` | ✅ Admin | Delete category |

---

## Query Parameters

### GET /users
| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `itemsPerPage` | number | Items per page (default: 10, max: 100) |
| `name` | string | Filter by name (case-insensitive) |
| `email` | string | Filter by email (case-insensitive) |
| `orderBy` | string | Sort by `joinDate`, `username`, or `name` |

### GET /stories
| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `itemsPerPage` | number | Items per page (default: 10, max: 100) |
| `title` | string | Filter by title (case-insensitive) |
| `author` | string | Filter by author username (case-insensitive) |
| `category` | string | Filter by category name |
| `createdAt` | date | Filter stories created on or after date |
| `orderBy` | string | Sort by `createdAt` or `title` |

---

## Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Token is obtained from `POST /auth/login`.

### Authorization Rules

| Action | Who can perform it |
|---|---|
| Edit/delete own story | Story owner |
| Edit/delete any story | Admin |
| Edit own profile | Any authenticated user |
| Edit/delete any user | Admin |
| Create/edit/delete categories | Admin only |
| View stories/categories | Public (no auth required) |

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "status": "error",
  "errors": [
    {
      "message": "User not found",
      "context": { "field": "userId" }
    }
  ]
}
```

### Common HTTP Status Codes

| Code | Meaning |
|---|---|
| 400 | Validation failed |
| 401 | Not authenticated / invalid credentials |
| 403 | Forbidden / insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, username, etc.) |
| 500 | Internal server error |

---

## Scripts

```bash
npm run dev           # Start dev server with hot reload (tsx watch)
npm run build         # Compile TypeScript to dist/
npm start             # Run compiled production build
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format with Prettier
npm run format:check  # Check formatting
npm run typecheck     # TypeScript type checking (no emit)
npm test              # Run Jest unit tests
npm run test:watch    # Jest in watch mode
npm run test:coverage # Jest with coverage report
```

---

## Testing

```bash
npm test
```

Unit tests cover:
- `UserService` — createUser, getUserById, updateUser, softDeleteUser
- `AuthService` — signup, login (including error cases)
- `StoryService` — getStoryById, updateStory, deleteStory (including ownership/admin checks)
- `UserController` — HTTP layer via Supertest

Coverage targets: **>80%** on services, **>70%** on controllers.

---

## Issues Implemented

| Issue | Description |
|---|---|
| #1 | Server connection (Express + TypeScript) |
| #2 | Database connection (PostgreSQL + Prisma) |
| #3 | User CRUD endpoints |
| #4 | ESLint + Prettier configuration |
| #5 | Zod validation |
| #6 | Custom error classes |
| #7 | Global error handling middleware |
| #8 | Story CRUD endpoints |
| #9 | Pagination and search |
| #10 | JWT Authentication and Authorization |
| #11 | Email confirmation |
| #12 | Category/Tag model |
| #13 | AI story summarization (Google Gemini) |
| #14 | Password change with OTP |
| #15 | User profile routes |
| #16 | Swagger API documentation |
| #17 | Unit testing with Jest |
