# Local Setup Guide

Follow these steps to run the Vitto Loan Application Portal on your local machine.

---

## 📋 Prerequisites
 Node.js (v18.x or higher)
 npm (v9.x or higher)
 PostgreSQL instance (local server or a free-tier database like Neon or Supabase)

---

## ⚙️ Step 1: Database Setup
You need a PostgreSQL database. You can use your existing local PostgreSQL installation or set up a free database on Neon.tech.

1. Create a database named `vitto_db`.
2. The schema will be automatically created on backend startup! If you prefer a manual setup, run the SQL script in:
   `migrations/001_init.sql`

---

## ⚙️ Step 2: Backend Setup & Start

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables template file to configure your app:
   ```bash
   cp .env.example .env
   ```
4. Open `.env` and fill in your details:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/vitto_db
   PGSSL=false
   JWT_SECRET=vitto_loan_portal_secure_secret_key_change_me
   ```
   Note: If you use a cloud provider like Neon, set `DATABASE_URL` to your cloud connection string and `PGSSL=true`.
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:5000`. On startup, it will automatically run any missing migrations.

---

## ⚙️ Step 3: Frontend Setup & Start

1. In a new terminal tab, navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. By default, the frontend is configured to call the local API server at `http://localhost:5000/api` (defined in `frontend/src/config.js`). If your server port is different, adjust `VITE_API_URL` or edit the config file.
4. Launch the frontend development server:
   ```bash
   npm run dev
   ```
5. Click the link in your terminal (usually `http://localhost:5173`) to open the app in your browser.

---

## 🔑 Demo Access Credentials
To test the Operations Dashboard, click Agent Portal in the navigation header and use the pre-seeded credentials:
 Username: `agent1`
 Password: `Password123`

