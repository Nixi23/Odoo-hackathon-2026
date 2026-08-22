# GlobeTrotter — Multi-City Travel Planner

An advanced, interactive travel-planning and itinerary-building web application developed for the **Odoo Hackathon 2026**. GlobeTrotter enables travelers to build multi-city, multi-day routes, track lodging and physical activity budgets in real-time, view currency conversions dynamically, and share public trip links with friends.

---

## Main Features

1. **Multi-Stop Route Builder:** Break down trips into distinct geographical segments, specifying arrival/departure dates and default lodging costs.
2. **Day-wise Itinerary Scheduler:** Plan daily activities by browsing the local tourist catalog or scheduling custom ones.
3. **Dynamic Currency Converter:** Input expenditures in base INR currency, convert to local currency automatically (supporting JPY, EUR, GBP, AED, SGD, THB, USD, IDR, CHF), and monitor real-time exchange rates.
4. **Real-time Budget Tracker:** Allocate total lodging, travel, and activity expenditures and receive live alerts if costs exceed the set budget limit.
5. **Interactive Trip Calendar:** View ongoing and upcoming vacation dates mapped on a dynamic monthly schedule grid.
6. **Community Travel Hub:** Write and share travel diaries, filter posts by categories (Tips, Adventure, Budget, Experiences), and search tag keywords.
7. **User Profile Settings:** Update traveler information, choose profile pictures, manage favorited destinations, and view past diaries.
8. **Admin Metric Dashboard:** Monitor system health, user registration growth curves (SVG Line chart), top planned locations (SVG Bar chart), and travel categories (SVG Pie chart).

---

## Technology Stack

### Frontend
- **Core:** React (JavaScript, JSX)
- **Tooling:** Vite, ESBuild
- **Styling:** Vanilla CSS (curated design tokens, glassmorphism, responsive grid layouts)
- **Icons:** Lucide React

### Backend
- **Core:** Node.js, Express, TypeScript (`ts-node-dev`)
- **Database:** SQLite
- **ORM:** Prisma ORM
- **Testing:** Jest, Supertest

---

## Project Directory Structure

```text
odoo_hackathon/
│
├── frontend/                     # React Vite Single Page App
│   ├── src/
│   │   ├── components/layout/    # App layout and sidebar
│   │   ├── pages/                # Screens (Dashboard, ItineraryBuilder, Admin, etc.)
│   │   ├── services/             # Mock data seed tables & currency Exchange rate calculations
│   │   └── ...
│   ├── public/                   # Static visual assets
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js TypeScript REST API
│   ├── src/
│   │   ├── config/               # Database setup and connection
│   │   ├── controllers/          # Business logic handlers
│   │   ├── middleware/           # Auth and error interceptors
│   │   ├── routes/               # Express routing endpoints
│   │   └── server.ts             # Application entry point
│   ├── prisma/                   # SQLite database models and migration seeds
│   ├── tests/                    # Backend Jest testing suites
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore                    # Root git configuration
└── README.md                     # Main documentation
```

---

## Installation & Setup

Ensure you have **Node.js (v18 or higher)** installed on your local machine.

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Set up the local environment file. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Run migrations and database seeds:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
5. Run the backend development server:
   ```bash
   npm run dev
   ```
   The backend will start on: **http://localhost:5000**

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will start on: **http://localhost:5173**

---

## Environment Variables Required

### Backend `.env` Variables:
- `PORT` - The port on which the Express server listens (default: `5000`)
- `DATABASE_URL` - Prisma connection string (e.g. `file:./dev.db`)
- `JWT_SECRET` - Signature key for verifying traveler JSON Web Tokens
