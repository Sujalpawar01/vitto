# Cloud Deployment Guide

This guide deploys Vitto with:

- PostgreSQL on Neon or Supabase
- Backend API on Render
- Frontend web app on Vercel

## 1. Create The PostgreSQL Database

Use Neon or Supabase and create a PostgreSQL database. Copy the pooled connection string if the provider offers one.

Example:

```text
postgresql://user:password@host/dbname?sslmode=require
```

Keep this value ready for Render as `DATABASE_URL`.

## 2. Deploy The Backend On Render

The repository includes `render.yaml`, so Render can read most service settings automatically.

1. Go to Render and create a new Blueprint or Web Service from the GitHub repository.
2. If creating a Web Service manually, use these settings:
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm ci`
   - Start Command: `npm start`
   - Health Check Path: `/`
3. Add these environment variables:
   - `NODE_ENV`: `production`
   - `NODE_VERSION`: `22`
   - `DATABASE_URL`: your PostgreSQL connection string
   - `PGSSL`: `true`
   - `JWT_SECRET`: a long secure random string
   - `FRONTEND_URL`: your Vercel URL after frontend deployment
4. Deploy the service.
5. Open the Render service URL. The health check should return:

```json
{
  "success": true,
  "message": "Vitto Loan Application Portal API is running."
}
```

The backend automatically runs `migrations/001_init.sql` on startup, creating the schema and seeding the default agent.

If Render starts from the repository root instead of `backend`, use these manual settings instead:

- Root Directory: leave blank
- Build Command: `npm run render:build`
- Start Command: `npm start`

## 3. Deploy On Vercel

The repository includes a root `vercel.json` with `experimentalServices` for this monorepo:

- `frontend` serves the Vite app from `/`
- `backend` is registered from `backend` at `/_/backend`

1. Go to Vercel and import the same GitHub repository.
2. Keep the project root as the repository root so Vercel can read `vercel.json`.
3. Add this environment variable for the frontend service:
   - `VITE_API_URL`: your Render backend URL plus `/api`

Example:

```text
https://vitto-backend.onrender.com/api
```

4. Deploy the project.
5. Copy the Vercel URL and add it to the Render backend `FRONTEND_URL` variable.
6. Redeploy the Render backend so the CORS setting takes effect.

## 4. End-To-End Smoke Test

After both deployments are live:

1. Visit the Vercel frontend URL.
2. Submit a loan application.
3. Open the Agent Portal.
4. Log in with:
   - Username: `agent1`
   - Password: `Password123`
5. Confirm the dashboard loads the submitted application.
6. Approve or reject the application and verify the status updates.

## Required Production URLs

Update these placeholders after deployment:

- README frontend URL
- README backend URL
- Render `FRONTEND_URL`
- Vercel `VITE_API_URL`
