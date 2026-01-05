# Cracked Digital - Backend & Admin Dashboard

A complete backend system with Firebase database, Node.js API, and admin dashboard for managing the Cracked Digital website.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          PROJECT STRUCTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │   Frontend   │────▶│   Backend    │────▶│   Firebase   │        │
│  │  (Vite+React)│◀────│  (Node.js)   │◀────│  (Firestore) │        │
│  └──────────────┘     └──────────────┘     └──────────────┘        │
│        :5173                :5000                                   │
│                                                                      │
│  ┌──────────────┐                                                   │
│  │    Admin     │─────────────────────────────▶                     │
│  │  Dashboard   │                                                   │
│  └──────────────┘                                                   │
│        :5174                                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
website/
├── src/                    # Main frontend (React + Vite)
│   ├── context/
│   │   └── DataContext.jsx # Data fetching context
│   ├── pages/              # Updated to use API data
│   └── ...
│
├── backend/                # Node.js Backend API
│   ├── src/
│   │   ├── index.js        # Express server entry
│   │   ├── config/
│   │   │   └── firebase.js # Firebase Admin SDK
│   │   ├── middleware/
│   │   │   ├── auth.js     # JWT authentication
│   │   │   └── upload.js   # Multer file uploads
│   │   ├── routes/
│   │   │   ├── auth.js     # Login/logout
│   │   │   ├── events.js   # Events CRUD
│   │   │   ├── stats.js    # Stats CRUD
│   │   │   ├── testimonials.js
│   │   │   ├── faqs.js
│   │   │   ├── milestones.js
│   │   │   ├── settings.js
│   │   │   ├── upload.js   # Image uploads
│   │   │   └── public.js   # Public data endpoint
│   │   ├── scripts/
│   │   │   └── seed.js     # Database seeding
│   │   └── utils/
│   │       └── helpers.js
│   ├── package.json
│   └── .env.example
│
└── admin/                  # Admin Dashboard (React + Vite)
    ├── src/
    │   ├── App.jsx
    │   ├── api/
    │   │   └── index.js    # API client
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── Header.jsx
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Dashboard.jsx
    │       ├── EventsManager.jsx
    │       ├── StatsManager.jsx
    │       ├── TestimonialsManager.jsx
    │       ├── FaqsManager.jsx
    │       ├── MilestonesManager.jsx
    │       ├── GalleryManager.jsx
    │       └── SettingsManager.jsx
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- Firebase service account key

### 1. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable **Firestore Database** (start in production mode)
4. Enable **Storage** (for image uploads)
5. Go to **Project Settings > Service Accounts**
6. Click **Generate New Private Key**
7. Save the JSON file as `firebase-service-account.json` in the `backend/` folder

### 2. Setup Backend

```bash
# Navigate to backend
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your Firebase config
# - Set FIREBASE_STORAGE_BUCKET to your-project.appspot.com
# - Set a strong JWT_SECRET
# - Set admin credentials for seeding

# Install dependencies
npm install

# Seed the database with initial data
npm run seed

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Setup Admin Dashboard

```bash
# In a new terminal, navigate to admin
cd admin

# Install dependencies
npm install

# Start the dashboard
npm run dev
```

The admin dashboard will run on `http://localhost:5174`

### 4. Start Frontend

```bash
# In a new terminal, from project root
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/public/all` | Get all public data (events, stats, testimonials, FAQs, milestones, settings) |
| GET | `/api/events` | List all events |
| GET | `/api/stats` | List all stats |
| GET | `/api/testimonials` | List active testimonials |
| GET | `/api/faqs` | List active FAQs |
| GET | `/api/milestones` | List all milestones |
| GET | `/api/settings` | Get site settings |

### Protected Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/password` | Change password |
| | | |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| PUT | `/api/events/:id/status` | Update event status |
| | | |
| POST | `/api/upload` | Upload single image |
| POST | `/api/upload/multiple` | Upload multiple images |
| DELETE | `/api/upload/:filename` | Delete image |
| GET | `/api/upload/list` | List all images |

## 🔐 Authentication

The admin dashboard uses JWT-based authentication.

**Default Credentials** (set in `.env`):
- Email: `admin@crackeddigital.com`
- Password: `CrackedAdmin2024!`

> ⚠️ **Important**: Change these credentials after first login!

### How Auth Works

1. Admin logs in with email/password
2. Server validates and returns JWT token
3. Token stored in localStorage
4. All subsequent requests include token in Authorization header
5. Token expires after 7 days (configurable)

## 🗄️ Database Schema

### Collections

**events**
```javascript
{
  title: string,
  date: string,           // "Oct 2023", "Coming Soon"
  type: "Past" | "Ongoing" | "Upcoming",
  description: string,
  images: string[],
  location: string,
  capacity: number,
  registrationUrl: string,
  order: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**stats**
```javascript
{
  label: string,          // "Active Members"
  value: string,          // "600+"
  numericValue: number,   // 600 (for animation)
  suffix: string,         // "+"
  icon: string,           // "Users"
  order: number
}
```

**testimonials**
```javascript
{
  name: string,
  role: string,
  company: string,
  image: string,
  text: string,
  isActive: boolean,
  order: number
}
```

**faqs**
```javascript
{
  question: string,
  answer: string,
  isActive: boolean,
  order: number
}
```

**milestones**
```javascript
{
  year: string,           // "Genesis", "2024"
  title: string,
  description: string,
  order: number
}
```

**settings** (single document: `site_settings`)
```javascript
{
  heroTagline: string,
  heroTitle1: string,
  heroTitle2: string,
  heroDescription: string,
  whatsappLink: string,
  instagramLink: string,
  linkedinLink: string,
  email: string,
  phone: string,
  address: string,
  footerTagline: string,
  joinCta: string
}
```

## 🖼️ Image Upload

Images are stored in Firebase Cloud Storage.

**Supported formats**: JPEG, PNG, GIF, WebP
**Max file size**: 10MB per image
**Max batch**: 10 images at once

Images are automatically made public and return a URL like:
```
https://storage.googleapis.com/your-bucket/images/uuid.jpg
```

## 🎨 Admin Dashboard Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview of all content counts, quick actions |
| **Events Manager** | Full CRUD, status changes, image management |
| **Stats Manager** | Edit stats with icon selection |
| **Testimonials** | Add/edit testimonials, toggle visibility |
| **FAQs** | Manage FAQs with visibility toggle |
| **Milestones** | Timeline/journey management |
| **Gallery** | Central image upload and management |
| **Settings** | Hero content, social links, contact info |

## 🔄 Frontend Loading Behavior

The frontend now:
1. Shows loading spinner on page load
2. Fetches all data from `/api/public/all`
3. Waits for BOTH data AND minimum animation time (2.2s)
4. Only then renders the content

This ensures:
- Data is always fresh from the database
- Smooth loading animation isn't cut short
- Graceful fallback to static data if API fails

## 🌐 Environment Variables

### Backend (.env)

```bash
# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=5000

# CORS
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Seeding
ADMIN_EMAIL=admin@crackeddigital.com
ADMIN_PASSWORD=CrackedAdmin2024!
```

### Frontend (optional .env)

```bash
VITE_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Connect to Railway/Render
3. Set environment variables
4. Deploy

### Admin Dashboard (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set `VITE_API_URL` to production backend URL

### Frontend (Vercel)

Already deployed! Just update `VITE_API_URL` if needed.

## 🔧 Development Tips

### Running All Services

Open 3 terminals:

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Admin
cd admin && npm run dev

# Terminal 3: Frontend
npm run dev
```

### Testing API

```bash
# Health check
curl http://localhost:5000/api/health

# Get all public data
curl http://localhost:5000/api/public/all

# Login (get token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crackeddigital.com","password":"CrackedAdmin2024!"}'
```

## 📝 License

MIT License - Cracked Digital
