# Noor-ul-Quran

**Your Digital Quran Companion** — Read, study, and connect with the Holy Quran.

A production-ready full-stack web application with Quran reader, audio recitations, AI assistant, admin dashboard, PWA support, and more.

## Tech Stack

### Frontend
- **Next.js 15** (App Router) — Server & client components, ISR, optimized images
- **React 18.3** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS 3** + **shadcn/ui** — Design system
- **Framer Motion** — Animations
- **React Hook Form** + **Zod** — Form validation
- **Zustand** — Client state management (persisted to localStorage)
- **Axios** — HTTP client
- **next-themes** — Dark/light/system theme
- **PWA** — Service worker, manifest, app icons

### Backend
- **Node.js** + **Express.js** — Server framework
- **MongoDB** + **Mongoose** — Database with 7 models
- **JWT** — Authentication (access + role-based)
- **bcrypt** — Password hashing
- **Helmet** — Security headers
- **express-rate-limit** — API rate limiting
- **Nodemailer** — Email service (verification, password reset)
- **OpenAI SDK** — AI assistant (optional, falls back to mock mode)

## Features

### Quran Reader
- **114 Surahs** — Full list with search, pagination, continue reading
- **6236+ Verses** — Arabic (Uthmani & Simple) with verse-by-verse display
- **Translations** — English (Saheeh International) & Urdu (Maulana Fateh Muhammad Jalandhri)
- **Word-by-Word** — Arabic with translation & transliteration
- **Tafsir** — Verse explanations (multiple sources)
- **Juz Reader** — Browse by Juz (all 30 parts)
- **Audio Recitations** — 5 reciters, surah-level playback, queue, speed control
- **Reading Progress** — Track position, auto-save per surah

### User Features
- **Bookmarks** — Save verses, organize by surah
- **Favorites** — Heart verses for quick access
- **Highlights** — 6 colors for verse annotation
- **Notes** — Personal reflections on any verse
- **Reading Streak** — Daily goal tracking
- **Dashboard** — Stats, recently read, activity overview

### AI Quran Assistant (6 features)
- **Ask Questions** — Ask anything about the Quran
- **Topic Finder** — Search verses by topic
- **Verse Explanation** — Get detailed tafsir for specific verses
- **Daily Reflection** — Random reflective verse each day
- **Quiz Generator** — Test your Quran knowledge
- **Memorization Helper** — Get tips for memorizing verses

### Admin Dashboard
- **Analytics** — User counts, content stats, activity overview
- **User Management** — Search, promote to admin, delete
- **Surah Management** — View & delete surahs (cascading)
- **Tafsir Management** — Filter by source, delete entries
- **Translation Management** — Filter by language, delete entries
- **Audio Management** — Filter by reciter, delete entries
- **Notifications** — Compose & send notifications

### Accessibility
- Skip-to-content link
- ARIA roles & labels throughout
- Keyboard navigation (modal focus trap, Escape to close)
- Screen reader-friendly (role="article", aria-live regions)
- Focus-visible outlines
- Reduced-motion support
- Touch-friendly targets (44px minimum)

### Performance
- Dynamic imports (AudioPlayer, BottomNavigation, ServiceWorker)
- React.memo on card components
- CSS animations (replaces framer-motion on 114-item list)
- Zustand persist (localStorage, reduces API calls)
- Sharp for next/image optimization
- Skeleton loading for all routes
- Scrollbar styling

### PWA
- Installable (manifest.json with 192/512 SVG icons)
- Service worker for offline fallback
- Theme color adapts to light/dark mode

## Project Structure

```
noor-ul-quran/
├── frontend/
│   ├── public/              # Static assets (icons, manifest, sw.js, robots.txt)
│   └── src/
│       ├── app/
│       │   ├── (auth)/      # Login, Signup, ForgotPassword, VerifyEmail
│       │   ├── (dashboard)/ # Dashboard, Profile, Settings
│       │   ├── (quran)/     # Surahs list, Surah reader, Juz reader
│       │   ├── admin/       # Admin dashboard (7 pages)
│       │   ├── ai/          # AI Quran Assistant
│       │   ├── layout.tsx   # Root layout (ThemeProvider, Navbar, Footer, AudioPlayer)
│       │   ├── page.tsx     # Landing page
│       │   ├── not-found.tsx# Custom 404
│       │   ├── error.tsx    # Error boundary
│       │   ├── loading.tsx  # Root loading skeleton
│       │   └── sitemap.ts   # Dynamic sitemap (167 entries)
│       ├── components/
│       │   ├── ui/          # 11 shadcn/ui components
│       │   ├── ai/          # ChatMessage, ChatInput, FeatureSelector, etc.
│       │   ├── audio/       # AudioPlayer, PlayButton, ProgressBar, SpeedControl
│       │   └── quran/       # AyahCard, SurahCard, SurahHeader, etc.
│       ├── hooks/           # useAuth, useSwipe
│       ├── lib/             # API client (Axios), utils, Zod validations
│       ├── store/           # 9 Zustand stores (auth, reader, audio, etc.)
│       └── types/           # TypeScript interfaces
├── backend/
│   └── src/
│       ├── config/          # env.ts, db.ts
│       ├── controllers/     # 9 controller files
│       ├── middleware/      # auth, error, admin middleware
│       ├── models/          # 8 Mongoose models
│       ├── routes/          # 9 route files
│       ├── scripts/         # Database seeder (fetch from AlQuranCloud API)
│       ├── services/        # Business logic layer
│       ├── utils/           # ApiFeatures, generateToken, sendEmail
│       └── index.ts         # Server entry point
├── .env.example
├── render.yaml              # Render Blueprint
├── DEPLOYMENT.md            # Full deployment guide
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Quick Start

```bash
# 1. Clone & install
git clone <repo>
cd noor-ul-quran
cp .env.example backend/.env

# 2. Backend
cd backend
npm install
npm run dev    # http://localhost:5000

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev    # http://localhost:3000
```

### Seed the Database (optional - fetches real Quran data)

```bash
cd backend
npm run seed
```

Populates: 114 surahs, 6236+ ayahs, 4 translation editions, word-by-word Arabic, tafsir (first 10 surahs), audio URLs for 5 reciters.

## API Routes

| Prefix | Description | Auth |
|--------|-------------|------|
| `/api/auth` | Register, login, verify, reset password | Mixed |
| `/api/surahs` | Surah list, by number, summary | No |
| `/api/ayahs` | Verses by surah/juz | No |
| `/api/translations` | Translations by surah + language | No |
| `/api/word-by-word` | Word-by-word data by surah | No |
| `/api/tafsir` | Tafsir by surah + ayah | No |
| `/api/audio` | Audio entries by surah + reciter | No |
| `/api/admin` | Admin operations (12 endpoints) | Admin |
| `/api/ai` | AI assistant (9 endpoints) | Mixed |
| `/api/health` | Health check | No |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Server port (Render sets this) |
| `NODE_ENV` | Yes | `production` or `development` |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Strong random string |
| `CLIENT_URL` | **Yes** | Frontend URL (for CORS) |
| `SMTP_USER` | No* | Gmail address for emails |
| `SMTP_PASS` | No* | Gmail app password |
| `OPENAI_API_KEY` | No | OpenAI key (mock mode without it) |

*Required for email verification/password reset.

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete guide covering:
- MongoDB Atlas setup
- Backend deployment on Render
- Frontend deployment on Vercel
- Environment variables reference
- Security checklist
- Performance optimization
- Post-deployment verification

## Build Status

```bash
# Frontend
cd frontend && npm run build    # 21 pages, zero errors

# Backend
cd backend && npm run build     # Compiles to dist/, zero errors
```

## License

MIT
