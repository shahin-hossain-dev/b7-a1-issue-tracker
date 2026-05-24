# DevPulse — Issue Tracker API

A backend REST API for software teams to report bugs, suggest features, and track issues through to resolution. Built as a learning project with Node.js, TypeScript, and PostgreSQL.

**Live URL:** https://b7-a2-issue-tracker.vercel.app

---

## Features

- User registration and login with JWT authentication
- Role-based access control — contributors and maintainers have different permissions
- Create, read, update, and delete issues
- Filter issues by type or status, sort by newest or oldest
- Reporter details are included in every issue response
- Passwords are hashed and never exposed in responses

---

## Tech Stack

| Technology           | Purpose                                    |
| -------------------- | ------------------------------------------ |
| Node.js + TypeScript | Runtime and type safety                    |
| Express.js           | HTTP server and routing                    |
| PostgreSQL           | Relational database                        |
| `pg`                 | Native PostgreSQL driver (raw SQL, no ORM) |
| bcryptjs             | Password hashing                           |
| jsonwebtoken         | JWT generation and verification            |
| tsup                 | TypeScript bundler                         |

---

## Getting Started

### Prerequisites

- Node.js 24+
- A PostgreSQL database (NeonDB, Supabase, or local)

### Setup

1. Clone the repository

```bash
git clone https://github.com/shahin-hossain-dev/b7-a1-issue-tracker
cd b7-a1-issue-tracker
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root

```env
CONNECTION_STRING=your_postgresql_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

4. Start the development server

```bash
npm run dev
```

The server will start on `http://localhost:5000`.

---

## API Endpoints

All protected routes require an `Authorization: <token>` header.

### Auth

| Method | Endpoint           | Access | Description             |
| ------ | ------------------ | ------ | ----------------------- |
| POST   | `/api/auth/signup` | Public | Register a new user     |
| POST   | `/api/auth/login`  | Public | Login and receive a JWT |

### Issues

| Method | Endpoint          | Access          | Description        |
| ------ | ----------------- | --------------- | ------------------ |
| POST   | `/api/issues`     | Authenticated   | Create a new issue |
| GET    | `/api/issues`     | Public          | Get all issues     |
| GET    | `/api/issues/:id` | Public          | Get a single issue |
| PATCH  | `/api/issues/:id` | Authenticated   | Update an issue    |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue    |

### Query Parameters for `GET /api/issues`

| Param    | Values                            | Default  |
| -------- | --------------------------------- | -------- |
| `sort`   | `newest`, `oldest`                | `newest` |
| `type`   | `bug`, `feature_request`          | —        |
| `status` | `open`, `in_progress`, `resolved` | —        |

---

## Database Schema

### `users`

| Column       | Type         | Notes                                   |
| ------------ | ------------ | --------------------------------------- |
| `id`         | SERIAL       | Primary key                             |
| `name`       | VARCHAR(100) | Required                                |
| `email`      | VARCHAR(100) | Unique, required                        |
| `password`   | TEXT         | Hashed, never returned                  |
| `role`       | ENUM         | `contributor` (default) or `maintainer` |
| `created_at` | TIMESTAMPTZ  | Auto-generated                          |
| `updated_at` | TIMESTAMPTZ  | Auto-updated                            |

### `issues`

| Column        | Type         | Notes                                       |
| ------------- | ------------ | ------------------------------------------- |
| `id`          | SERIAL       | Primary key                                 |
| `title`       | VARCHAR(150) | Required                                    |
| `description` | TEXT         | Min 20 characters                           |
| `type`        | ENUM         | `bug` or `feature_request`                  |
| `status`      | ENUM         | `open` (default), `in_progress`, `resolved` |
| `reporter_id` | INT          | References `users.id`                       |
| `created_at`  | TIMESTAMPTZ  | Auto-generated                              |
| `updated_at`  | TIMESTAMPTZ  | Auto-updated                                |

---

## User Roles

| Role            | Permissions                                                                    |
| --------------- | ------------------------------------------------------------------------------ |
| **contributor** | Register, login, create issues, view all issues, update own open issues        |
| **maintainer**  | All contributor permissions + update any issue + change status + delete issues |

---
