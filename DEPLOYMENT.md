# Noor-ul-Quran - Deployment Guide

> **Stack**: Next.js 15 (Frontend) + Express.js / Node.js (Backend) + MongoDB (Database)

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [MongoDB Atlas Setup](#2-mongodb-atlas-setup)
3. [Backend Deployment (Render)](#3-backend-deployment-render)
4. [Frontend Deployment (Vercel)](#4-frontend-deployment-vercel)
5. [Environment Variables Reference](#5-environment-variables-reference)
6. [Production Build Configuration](#6-production-build-configuration)
7. [Security Checklist](#7-security-checklist)
8. [Performance Optimization](#8-performance-optimization)
9. [Post-Deployment Verification](#9-post-deployment-verification)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

- A **MongoDB Atlas** account (free tier suitable)
- A **Render** account for backend hosting (or Railway / Fly.io)
- A **Vercel** account for frontend hosting (or Netlify)
- **Git** repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ locally for testing

---

## 2. MongoDB Atlas Setup

1. **Create a cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas) → Sign up / Log in
   - Create a new cluster (free M0 tier is sufficient)
   - Choose a cloud provider (AWS) and region closest to your users

2. **Create a database user**
   - In the left sidebar → **Database Access** → **Add New Database User**
   - Username: `noorulquran` (or your choice)
   - Password: generate a strong password and **save it securely**
   - Built-in Role: `Atlas admin`

3. **Network access**
   - In the left sidebar → **Network Access** → **Add IP Address**
   - For Render: add `0.0.0.0/0` (Render uses dynamic IPs)
   - For development: add your current IP

4. **Get connection string**
   - Click **Connect** → **Connect your application**
   - Driver: **Node.js**, Version: **4.1 or later**
   - Copy the connection string: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/noor-ul-quran?retryWrites=true&w=majority`
   - Replace `<username>` and `<password>` with your credentials

5. **Seed the database** (run locally after deployment)
   ```bash
   cd backend
   npm install
   # Set MONGO_URI to your Atlas connection string in backend/.env
   npm run seed
   ```

---

## 3. Backend Deployment (Render)

### 3.1 Prepare the repository

1. Push your code to GitHub (or GitLab/Bitbucket)
2. Ensure `backend/.gitignore` excludes `node_modules/`, `dist/`, `.env`

### 3.2 Create a Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `noor-ul-quran-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Add environment variables (see [Section 5](#5-environment-variables-reference)):
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=<your-atlas-connection-string>
   JWT_SECRET=<generate-a-strong-random-string>
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://your-frontend.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your-email>
   SMTP_PASS=<your-app-password>
   OPENAI_API_KEY=<optional>
   ```

5. **Deploy** → wait for build to complete

6. **Health check**: visit `https://noor-ul-quran-api.onrender.com/api/health`

### 3.3 Production start script

The `backend/package.json` start script runs `node dist/index.js`. Ensure the build (`npm run build`) outputs to `dist/`.

### 3.4 Render CORS configuration

The backend reads `CLIENT_URL` for CORS. Set it to your production frontend URL:
```
CLIENT_URL=https://your-frontend.vercel.app
```

---

## 4. Frontend Deployment (Vercel)

### 4.1 Prepare the repository

1. Ensure `frontend/.gitignore` excludes `.next/`, `node_modules/`, `.env*.local`

### 4.2 Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/) → **Add New** → **Project**
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://noor-ul-quran-api.onrender.com/api
   ```

5. **Deploy** → Vercel detects Next.js automatically

### 4.3 Custom domain (optional)

1. In Vercel → your project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `CLIENT_URL` in the backend's Render environment variables to match

### 4.4 Image domains

The `next.config.ts` already whitelists `cdn.islamic.network` and `quran.com`. No additional config needed.

---

## 5. Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | Yes (Render sets this) | Server port | `5000` |
| `NODE_ENV` | Yes | Environment mode | `production` |
| `MONGO_URI` | **Yes** | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | **Yes** | Secret key for JWT signing | `openssl rand -hex 64` |
| `JWT_EXPIRES_IN` | No | JWT token expiry | `7d` |
| `CLIENT_URL` | **Yes** | Frontend URL for CORS | `https://noorulquran.vercel.app` |
| `SMTP_HOST` | No | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | No | SMTP server port | `587` |
| `SMTP_USER` | No* | SMTP username/email | `your@gmail.com` |
| `SMTP_PASS` | No* | SMTP app password | `xxxx xxxx xxxx xxxx` |
| `OPENAI_API_KEY` | No | OpenAI API key (optional) | `sk-proj-...` |

*Required for email verification and password reset.

### Frontend (`frontend/.env.local` or Vercel env vars)

| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | Backend API base URL | `https://api.noorulquran.com/api` |

---

## 6. Production Build Configuration

### 6.1 Frontend (Next.js)

The current `next.config.ts` uses the default output mode. For production:

**Recommended additions to `next.config.ts`:**

```ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.islamic.network" },
      { protocol: "https", hostname: "quran.com" },
    ],
  },
  // Enable compression
  compress: true,
  // React strict mode for development
  reactStrictMode: true,
  // Powered-By header removal
  poweredByHeader: false,
}

export default nextConfig
```

### 6.2 Backend (Express + TypeScript)

The TypeScript build outputs to `backend/dist/`. The production command is:

```bash
node dist/index.js
```

Environment variables are loaded from `backend/.env` via `dotenv`.

### 6.3 Error handling

The app uses a centralized error handler middleware. Unhandled rejections should be caught:

```ts
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
})
```

---

## 7. Security Checklist

- [x] **Helmet** — HTTP security headers enabled globally
- [x] **CORS** — Restricted to `CLIENT_URL` (single origin)
- [x] **Rate Limiting** — 100 requests / 15 min on all `/api/` routes
- [x] **JSON Body Limit** — 1 MB max payload
- [ ] **JWT Secret** — Use a strong random string (`openssl rand -hex 64`)
- [ ] **MongoDB Atlas** — Network access restricted (or `0.0.0.0/0` for Render)
- [ ] **Environment Variables** — Never commit `.env` files; use platform secret managers
- [ ] **HTTPS** — Enforced by Vercel (frontend) and Render (backend)
- [ ] **Input Validation** — Zod schemas on frontend; Mongoose validation + sanitization on backend
- [ ] **Auth Middleware** — JWT verification on protected routes; admin role check on admin routes
- [ ] **Email Credentials** — Use Gmail App Passwords (not your regular password)

### Recommended additional security measures

1. **CSP Headers** — Add Content-Security-Policy via Helmet:
   ```ts
   app.use(
     helmet({
       contentSecurityPolicy: {
         directives: {
           defaultSrc: ["'self'"],
           imgSrc: ["'self'", "cdn.islamic.network", "quran.com"],
           connectSrc: ["'self'", "https://api.openai.com"],
         },
       },
     })
   )
   ```

2. **Environment-specific CORS** — Allow multiple origins for flexibility:
   ```ts
   const allowedOrigins = [config.clientUrl]
   app.use(cors({ origin: allowedOrigins, credentials: true }))
   ```

3. **Bcrypt rounds** — Set to 12 (already the default or configured in User model)

---

## 8. Performance Optimization

### 8.1 Already implemented

- **Dynamic imports** — AudioPlayer, ServiceWorkerRegister, BottomNavigation (ssr: false)
- **React.memo** — AyahCard, SurahCard, ChatMessage
- **CSS animations** — Replaced framer-motion stagger on 114 surah cards with CSS `animation`
- **Zustand persist** — All stores use localStorage, reducing API calls
- **Sharp** — Installed for next/image production optimization
- **Skeleton loading** — AyahSkeleton, SurahSkeleton during data fetch
- **Error boundaries** — ErrorState component for failed requests

### 8.2 Recommended improvements

| Improvement | Impact | Effort |
|---|---|---|
| **Next.js Standalone output** (`output: "standalone"`) | Smaller Docker images | Low |
| **Image lazy loading** via `next/image` | Faster initial paint | Low |
| **ISR for surah pages** (`revalidate` in fetch) | Static + dynamic hybrid | Medium |
| **CDN for static assets** via Vercel Edge | Global low latency | Free |
| **Database indexes** (already created in models) | Faster queries | Done |
| **Redis caching** for frequent API responses | Reduced DB load | High |
| **Bundle analysis** (`@next/bundle-analyzer`) | Identify large deps | Low |

### 8.3 Image optimization

`sharp` is installed. For production, next/image automatically:
- Serves WebP/AVIF formats
- Resizes images to device dimensions
- Lazy loads below-the-fold images

Remote images from `cdn.islamic.network` and `quran.com` are already whitelisted.

---

## 9. Post-Deployment Verification

### 9.1 Backend health check

```bash
curl https://noor-ul-quran-api.onrender.com/api/health
# Expected: {"status":"ok","timestamp":"2026-06-29T..."}
```

### 9.2 Seed the database

```bash
cd backend
npm install
# Set MONGO_URI in backend/.env to Atlas connection string
npm run seed
# Seeds: 114 surahs, 6236+ ayahs, 4 translations, word-by-word, tafsir, audio URLs
```

### 9.3 Test core flows

1. **Homepage** — https://your-frontend.vercel.app
2. **Surah list** — `/surahs` → should load 114 surahs
3. **Surah reader** — `/surahs/1` → should display verses
4. **Juz reader** — `/juz/1` → should display verses
5. **Audio playback** — Click play on a surah → audio should stream from CDN
6. **Authentication** — Sign up → verify email → log in → access dashboard
7. **Admin** — First user becomes admin → access `/admin`
8. **AI assistant** — `/ai` → should load with mock or OpenAI responses
9. **Dark mode** — Toggle should persist across pages
10. **Mobile** — Bottom navigation, swipe gestures, responsive layout

### 9.4 Monitor

- **Render** — Dashboard shows logs, CPU, memory
- **Vercel** — Dashboard shows analytics, speed insights, error logs
- **MongoDB Atlas** — Monitoring shows connections, operations, latency

---

## 10. Troubleshooting

### MongoDB connection errors

- Check that `MONGO_URI` is correct in Render env vars (not in a local `.env`)
- Verify Atlas network access includes `0.0.0.0/0` for Render
- Verify the database user has correct permissions

### CORS errors (frontend cannot reach backend)

- Check `CLIENT_URL` in backend env vars matches the frontend URL exactly
- For Vercel preview deployments, the URL changes with each deploy; update `CLIENT_URL` accordingly
- Ensure no trailing slash in `CLIENT_URL`

### Build failures on Render

- Set root directory to `backend`
- Build command: `npm install && npm run build`
- If `ts-node` fails, ensure `typescript` is in `devDependencies`

### Build failures on Vercel

- Set root directory to `frontend`
- Framework preset: Next.js
- If SWC errors appear, they are cosmetic (WASM fallback on Windows) and do not affect the deployment

### "Too many requests" error

- Rate limit: 100 requests per 15 minutes per IP
- Increase `max` in `rateLimit()` config if needed
- Whitelist trusted IPs if rate limiting is too aggressive

### Email not sending

- Gmail requires an [App Password](https://support.google.com/accounts/answer/185833)
- Enable 2-factor authentication on the Gmail account first
- Use the 16-character app password in `SMTP_PASS`
- Check Render egress firewall (free tier may block port 587)

---

> **Next steps after deployment**: Update the `README.md` with live URLs, configure a custom domain, set up monitoring (Sentry, LogRocket), and add CI/CD with GitHub Actions.
