# GlobeTrotter Backend — REST API Server

Welcome to the backend server of **GlobeTrotter**, a personalized, intelligent, and collaborative multi-city travel planning platform. This server is implemented in **Node.js**, **Express.js**, and **TypeScript**, using **Prisma ORM** with a **SQLite** database for relational storage. It uses **JWT** for secure user sessions.

---

## 🛠️ Technology Stack

- **Runtime:** Node.js (v20+)
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma ORM
- **Database:** SQLite (default for portability, easily configures to PostgreSQL/MySQL via Prisma settings)
- **Authentication:** JWT (JSON Web Tokens)
- **Encryption:** bcryptjs
- **Testing:** Jest & Supertest

---

## 🚀 Getting Started

### 1. Install Dependencies
Navigate to the `backend/` directory and install the packages:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the template `.env.example` to `.env` and adjust the variables:
```bash
# On Linux/macOS
cp .env.example .env

# On Windows (PowerShell)
Copy-Item .env.example .env
```

Ensure `.env` contains:
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-key-for-hackathon-globetrotter"
FRONTEND_URL="http://localhost:5173"
```

### 3. Setup Relational Database & Migrations
Execute the migrations to generate the SQLite database and seed initial cities/activities libraries:
```bash
# Run migrations & generate Prisma client
npm run prisma:migrate

# Seed default cities and activities
npm run prisma:seed
```

---

## 🏃 Running the Server

### Development Mode (Hot-Reloading)
Runs the server with `ts-node-dev`:
```bash
npm run dev
```

### Production Mode (Compiled JS)
Compiles TypeScript files to the `dist/` directory and executes:
```bash
npm run build
npm start
```

---

## 🧪 Testing

We have built a comprehensive integration test suite covering Register, Login, CRUD Trips, Transactional Stop Builders, Favoriting, and Admin Analytics.
To run all tests:
```bash
npm run test
```

---

## 📍 API Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Body Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/register` | Public | `name`, `email`, `password` | Registers a new account and returns token. |
| **POST** | `/login` | Public | `email`, `password` | Logs in and issues JWT token. |
| **GET** | `/me` | JWT | None | Fetches the current logged in user details. |

### 2. User Profiles & Favorites (`/api/users`)
| Method | Endpoint | Access | Body Parameters / Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| **PUT** | `/profile` | JWT | `name`, `email`, `language`, `photo` | Modifies user settings. |
| **DELETE**| `/profile` | JWT | None | Permanently deletes account & cascades trips. |
| **GET** | `/saved-destinations` | JWT | None | Lists user's favorited cities. |
| **POST** | `/saved-destinations/:cityId` | JWT | Path `:cityId` | Saves a city to favorites catalog. |
| **DELETE**| `/saved-destinations/:cityId` | JWT | Path `:cityId` | Unfavorites a city. |

### 3. Explore Destinations (`/api/explore`)
| Method | Endpoint | Access | Query Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/cities` | Public | `search`, `region` | Search cities with filters. |
| **GET** | `/cities/:cityId/activities` | Public | `search`, `category`, `maxCost` | Browse standard activities for a city. |

### 4. Trips & Routes Builder (`/api/trips`)
| Method | Endpoint | Access | Request Details | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | JWT | None | Lists user's custom travel plans. |
| **GET** | `/:id` | Public/JWT | Path `:id` | Gets trip detail (stops/activities). Accessible if public or owner. |
| **POST** | `/` | JWT | `name`, `startDate`, `endDate`, `budgetLimit`, etc. | Creates a new itinerary outline. |
| **PUT** | `/:id` | JWT | Updates trip metadata fields | Updates trip details. |
| **DELETE**| `/:id` | JWT | Path `:id` | Deletes trip. |
| **POST** | `/:id/clone` | JWT | Path `:id` | Duplicates another user's public trip. |
| **PUT** | `/:tripId/stops` | JWT | Array `stops` (nested `activities`) | Bulk updates stops/route in a transaction. |

### 5. Admin Panel (`/api/admin`)
| Method | Endpoint | Access | Role Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/stats` | JWT | `Admin` | Aggregates system metrics, popular cities, growth timelines. |

---

## 🔑 Demo Account Credentials
For testing admin modules, register or sign-in with:
- **Email:** `admin@globetrotter.com`
- **Password:** `password123` (or any string >= 6 chars)
*(Signing up with this specific email will automatically set the role to `Admin` for demonstration purposes).*
