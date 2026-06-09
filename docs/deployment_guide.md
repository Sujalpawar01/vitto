# Cloud Deployment Guide

This document outlines the step-by-step process for deploying the Vitto Loan Application Portal to cloud services.

---

## 🗄️ Step 1: Database Deployment (Neon / Supabase)
Both Neon and Supabase offer free-tier PostgreSQL databases.

### Deploying via Neon (Recommended)
1. Go to [Neon.tech](https://neon.tech/) and sign up.
2. Create a new project named `vitto-portal`.
3. Choose the **PostgreSQL** version (15 or 16).
4. Copy the connection string under **Connection Details**. Select **Node.js (pg)** or **Pooled Connection** (recommended for serverless/Render).
   *Example:* `postgresql://neondb_owner:password@ep-cool-snowflake-12345.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
5. Keep this connection string ready; you will feed it as `DATABASE_URL` to the backend.

---

## 💻 Step 2: Backend API Deployment (Render / Railway)

### Deploying to Render
1. Sign up on [Render](https://render.com/).
2. Create a new **Web Service** and link your GitHub repository.
3. Configure the following fields:
   * **Name**: `vitto-backend`
   * **Root Directory**: `backend` (Crucial - do not leave blank)
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Expand the **Advanced** section and add the following **Environment Variables**:
   * `NODE_ENV`: `production`
   * `PORT`: `5000` (Render will override this, but it is good to configure)
   * `DATABASE_URL`: *[Paste your Neon connection string here]*
   * `PGSSL`: `true`
   * `JWT_SECRET`: *[A long secure random string, e.g. `d8d0e74f28e21183cf9f1437ee9bf918...`]*
5. Click **Deploy Web Service**. Render will spin up the container, connect to the database, automatically execute migrations to create tables and seed the default agent, and expose a public URL (e.g. `https://vitto-backend.onrender.com`).
6. Copy this API URL; you will need it for the frontend config.

---

## 🖥️ Step 3: Frontend Deployment (Vercel / Netlify)

### Deploying to Vercel
1. Sign up on [Vercel](https://vercel.com/).
2. Create a new project and select your GitHub repository.
3. Configure the settings:
   * **Framework Preset**: `Vite` (Vercel detects this automatically)
   * **Root Directory**: `frontend` (Crucial - do not leave blank)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Expand the **Environment Variables** section and add:
   * `VITE_API_URL`: *[Paste your live backend URL from Step 2, appending `/api`]*
     *Example:* `https://vitto-backend.onrender.com/api`
5. Click **Deploy**. Vercel will build your static React app and deploy it globally.
6. Once deployed, test your application end-to-end:
   * Submit a loan on the home page.
   * Access the agent portal, log in, and check if you can search, filter, and approve/reject applications.
