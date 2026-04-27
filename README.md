## 🌐 Live Demo
🔗 https://dashboard-ptl.netlify.app

# DASH CRM — Full Stack Web Application

A polished, production-ready full stack CRM dashboard built with React.js, Node.js, Express, and MySQL — featuring role-based access control, real-time pipeline analytics, and a modern dark-themed UI.

---

## ✨ Features

- **Authentication** — Email/password login with JWT sessions, bcrypt password hashing, and persistent auth state
- **Role-Based Access Control (RBAC)** — Three distinct roles (Admin, Sales, Viewer) with granular permissions
- **Dashboard Overview** — Real-time stat cards showing Total Leads, Active Deals, Revenue, Win Rate, Pending Tasks, and Pipeline Value
- **Leads Management** — Full CRUD with pipeline stages (Discovery → Qualified → Proposal → Negotiation → Won)
- **Tasks Management** — Create, edit, complete, and delete tasks with priority levels (High/Medium/Low)
- **Pipeline View** — Visual pipeline breakdown with stage-wise analytics
- **Search** — Global search bar that filters leads (by name, company, stage, value) and tasks (by title, priority, assignee, due date) across all tabs
- **Demo Data** — Auto-seeded 15 leads and 12 tasks on first startup for instant demo
- **Protected Routes** — Unauthenticated users are redirected to login
- **Responsive UI** — Fully responsive sidebar layout for desktop and mobile

---

## 🔐 Role Permissions

| Feature             | Admin | Sales | Viewer |
|---------------------|-------|-------|--------|
| View Dashboard      | ✅    | ✅    | ✅     |
| View Leads          | ✅    | ✅    | ❌     |
| Create/Edit Leads   | ✅    | ✅    | ❌     |
| Delete Leads        | ✅    | ❌    | ❌     |
| View Pipeline       | ✅    | ✅    | ❌     |
| View Tasks          | ✅    | ✅    | ✅     |
| Create/Edit Tasks   | ✅    | ✅    | ❌     |
| Delete Tasks        | ✅    | ❌    | ❌     |
| Manage Users        | ✅    | ❌    | ❌     |

---

## 🛠 Tech Stack

| Layer     | Tech                                     |
|-----------|------------------------------------------|
| Frontend  | React.js, React Router v6, Axios, Vite   |
| Backend   | Node.js, Express.js                      |
| Database  | MySQL + Sequelize ORM                    |
| Auth      | JWT (jsonwebtoken) + bcrypt              |
| Styling   | Pure CSS (custom design system, no libs) |

---

## 📁 Project Structure

```
fullstack-app/
├── backend/
│   ├── src/
│   │   ├── config/db.js            # MySQL Sequelize connection (local + cloud)
│   │   ├── middleware/auth.js      # JWT protect + role authorize middleware
│   │   ├── models/
│   │   │   ├── User.js             # User model (name, email, password, role)
│   │   │   ├── Lead.js             # Lead model (name, company, status, value, source)
│   │   │   └── Task.js             # Task model (title, priority, due, status, assignee)
│   │   ├── routes/
│   │   │   ├── auth.js             # Login, /me, seed routes
│   │   │   └── dashboard.js       # Stats, leads CRUD, tasks CRUD, users
│   │   └── server.js               # Express entry + auto-seed users & demo data
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── context/AuthContext.jsx  # Auth state + login/logout + token persistence
    │   ├── services/api.js          # Axios API client for dashboard endpoints
    │   ├── pages/
    │   │   ├── LoginPage.jsx        # Login form with demo account quick-fill
    │   │   ├── LoginPage.css
    │   │   ├── DashboardPage.jsx    # Main dashboard with tabs & CRUD modals
    │   │   └── DashboardPage.css
    │   ├── App.jsx                  # Router + PrivateRoute / PublicRoute guards
    │   ├── main.jsx
    │   └── index.css                # Global design tokens & variables
    ├── .env
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL Server running locally (e.g., via XAMPP, MySQL Workbench, or Docker)

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fullstack-app.git
cd fullstack-app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file with your MySQL credentials:

```env
PORT=5001
DB_NAME=crm_dashboard
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

> **Note:** For production deployment (e.g., Render), set `MYSQL_PUBLIC_URL` instead — the app will automatically use it with SSL.

Start the backend:

```bash
npm run dev       # development (with nodemon hot-reload)
# or
npm start         # production
```

The server runs at **http://localhost:5001**

On first startup, the server automatically:
1. Connects to MySQL and syncs the database schema
2. Seeds 3 user accounts (Admin, Sales, Viewer)
3. Seeds 15 demo leads and 12 demo tasks

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend:

```bash
npm run dev
```

The app runs at **http://localhost:5173** (or next available port).

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint          | Auth   | Role  | Description                    |
|--------|-------------------|--------|-------|--------------------------------|
| POST   | `/api/auth/login` | No     | Any   | Login with email + password    |
| GET    | `/api/auth/me`    | Yes    | Any   | Get current authenticated user |
| GET    | `/api/auth/seed`  | No     | —     | Re-seed all demo users         |

### Dashboard Stats
| Method | Endpoint               | Auth | Role  | Description                          |
|--------|------------------------|------|-------|--------------------------------------|
| GET    | `/api/dashboard/stats` | Yes  | Any   | Real-time stats (leads, revenue, etc.) |

### Leads
| Method | Endpoint                     | Auth | Role         | Description       |
|--------|------------------------------|------|--------------|-------------------|
| GET    | `/api/dashboard/leads`       | Yes  | Any          | Get all leads     |
| POST   | `/api/dashboard/leads`       | Yes  | Admin, Sales | Create a new lead |
| PUT    | `/api/dashboard/leads/:id`   | Yes  | Admin, Sales | Update a lead     |
| DELETE | `/api/dashboard/leads/:id`   | Yes  | Admin only   | Delete a lead     |

### Tasks
| Method | Endpoint                     | Auth | Role         | Description       |
|--------|------------------------------|------|--------------|-------------------|
| GET    | `/api/dashboard/tasks`       | Yes  | Any          | Get all tasks     |
| POST   | `/api/dashboard/tasks`       | Yes  | Admin, Sales | Create a new task |
| PUT    | `/api/dashboard/tasks/:id`   | Yes  | Admin, Sales | Update a task     |
| DELETE | `/api/dashboard/tasks/:id`   | Yes  | Admin only   | Delete a task     |

### Users (Admin only)
| Method | Endpoint                     | Auth | Role       | Description       |
|--------|------------------------------|------|------------|-------------------|
| GET    | `/api/dashboard/users`       | Yes  | Admin only | Get all users     |

---

## 🔐 Demo Login Credentials

The server auto-seeds these accounts on startup:

| Role          | Email            | Password      |
|---------------|------------------|---------------|
| Administrator | `admin@crm.com`  | `Admin@1234`  |
| Sales Rep     | `sales@crm.com`  | `Sales@1234`  |
| Viewer        | `user@crm.com`   | `User@1234`   |

> 💡 The login page has **Quick Login** buttons to auto-fill these credentials.

> 🔒 All passwords are hashed with bcrypt before storage.

---

## 📊 Demo Data

The server auto-seeds the following on first startup (if no leads exist):

**15 Leads** across all pipeline stages:
- Discovery (3) · Qualified (3) · Proposal (3) · Negotiation (3) · Won (3)
- Companies include Infosys, TCS, Wipro, HCL, Cognizant, Flipkart, HDFC Bank, Tata Motors, and more

**12 Tasks** with mixed priorities and statuses:
- 4 High · 4 Medium · 4 Low priority
- 9 Pending · 3 Completed

> To re-seed users, visit `http://localhost:5001/api/auth/seed` in your browser.

---

## 📝 License

MIT
