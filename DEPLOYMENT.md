# Deployment Guide for CMatrix

This guide covers two ways to host your CMatrix project for free:
1. **Self-Hosting with Cloudflare Tunnel** (Easiest, runs on your machine)
2. **Cloud Hosting with Render & Vercel** (Permanent, runs in the cloud)

---

## Option 1: Self-Hosting with Cloudflare Tunnel

This method exposes your local running application to the internet.
**Pros:** Easiest setup, keeps data local, free.
**Cons:** Your computer must stay on for the site to be accessible.

### Prerequisites
- Your application must be running locally:
  - Backend on port 8000 (`cd backend && ./dev.sh`)
  - Frontend on port 3000 (`cd frontend && pnpm dev`)

### Steps

1. **Start the Tunnel**
   You are likely already doing this! Run:
   ```bash
   ./cloudflared tunnel --url http://localhost:3000
   ```

2. **Get the URL**
   Look at the terminal output for a line like:
   ```
   +--------------------------------------------------------------------------------------------+
   |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
   |  https://random-name.trycloudflare.com                                                   |
   +--------------------------------------------------------------------------------------------+
   ```
   Copy that URL (e.g., `https://something-cool.trycloudflare.com`).

3. **Share**
   Send this URL to anyone. They can access your app.
   
   **Note:** Since your Frontend proxies API requests to `localhost:8000` (server-side), and your Backend is running on the same machine, everything will work automatically without extra configuration!

---

## Option 2: Cloud Hosting (Render + Vercel)

This method deploys your app to cloud servers.
**Pros:** Always online, doesn't use your computer's resources.
**Cons:** Setup is more complex, free tiers have limits (e.g., spin-down on inactivity).

### 1. Deploy Backend (Render)

We use Render because it supports Docker (needed for `nmap` and system tools).

1. Push your code to GitHub.
2. Sign up at [render.com](https://render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Select the `backend` directory (or root if using the root `docker-compose`, but usually simpler to deploy backend separately).
   - **Runtime:** Docker
   - **Root Directory:** `backend`
   - **Plan:** Free
6. Click **Create Web Service**.
7. Wait for deployment. Copy the **Backend URL** (e.g., `https://cmatrix-backend.onrender.com`).

### 2. Deploy Frontend (Vercel)

1. Sign up at [vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure Project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Environment Variables:**
     - Name: `PYTHON_BACKEND_URL`
     - Value: `https://cmatrix-backend.onrender.com` (The URL from step 1, **without** trailing slash)
5. Click **Deploy**.

### 3. Final Configuration

Once both are running, your frontend on Vercel will talk to your backend on Render.

---

## Troubleshooting

### "Cannot connect to Python backend"
- **Tunnel:** Ensure `backend/dev.sh` is running.
- **Cloud:** Check the Vercel logs. Ensure `PYTHON_BACKEND_URL` is set correctly.

### CORS Errors
- If deploying to the cloud, you might need to update `backend/app.py` to allow the Vercel domain in `allow_origins`.
