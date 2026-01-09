# Cracked Digital - Website

A premium, liquid glass-themed React website for Central India's premier tech community.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 📁 Project Structure

```
website/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable components
│   │   │   ├── LiquidCard.jsx
│   │   │   ├── LiquidButton.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── ImageSlider.jsx
│   │   ├── layout/           # Layout components
│   │   │   ├── Navigation.jsx
│   │   │   └── Footer.jsx
│   │   ├── modals/           # Modal components
│   │   │   └── EventModal.jsx
│   │   └── sections/         # Section components
│   │       └── TestimonialSlider.jsx
│   ├── hooks/                # Custom React hooks
│   │   └── useBodyScrollLock.js
│   ├── pages/                # Page components
│   │   ├── HomePage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── AboutPage.jsx
│   │   └── HirePage.jsx
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── index.html                # HTML entry point
├── package.json              # Dependencies
└── vite.config.js            # Vite configuration
```

## 🛠️ Technologies Used

- **React 18** - UI library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server
- **Tailwind CSS** (via utility classes) - Styling

## ✨ Features

- 🎨 Liquid glass morphism design
- 🌈 Smooth page transitions
- 📱 Fully responsive layout
- 🎭 Interactive animations
- 🔍 SEO optimized
- ⚡ **Smart Caching** - LocalStorage caching with version control for instant loads
- 🔄 **Auto-Updates** - Content updates automatically invalidate user caches
- 🚀 **Performance** - 80% reduction in API calls on return visits

## 📄 Pages

1. **Home** - Hero section with stats and FAQ
2. **Events** - Event listings with modal details
3. **Blog** - Tech insights and articles (`/blog`)
4. **About** - Timeline, Team, and testimonials
5. **Hire** - B2B contact form

## 🎨 Design System

The project uses a consistent liquid glass design system with:
- Backdrop filters and blur effects
- Subtle gradients and shadows
- Interactive hover states
- Smooth animations and transitions

## 📝 License

© 2024 Cracked Digital. All rights reserved.
