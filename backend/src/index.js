import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import hpp from 'hpp';

// Import routes
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import teamRoutes from './routes/team.js';
import testimonialsRoutes from './routes/testimonials.js';
import faqsRoutes from './routes/faqs.js';
import statsRoutes from './routes/stats.js';
import milestonesRoutes from './routes/milestones.js';
import blogRoutes from './routes/blog.js';
import hiringRoutes from './routes/hiring.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import publicRoutes from './routes/public.js';
import versionRoutes from './routes/version.js';

const app = express();
const PORT = process.env.PORT || 5000;


// CORS configuration
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        process.env.ADMIN_URL || 'http://localhost:5174',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// console.log(`Backend module loaded. Environment: ${process.env.NODE_ENV}`);

// Middleware
app.enable('trust proxy'); // Required for Vercel/proxies

// Security Middleware
app.use(helmet());
app.use(xss());
app.use(hpp());

// Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: 'Too many attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(cors(corsOptions));
app.use(compression());
app.use('/api/', globalLimiter); // Apply global limit to all API routes

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (development & production URL check)
app.use((req, res, next) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers.host;
    console.log(`[Backend Access] Request URL: ${protocol}://${host}${req.originalUrl}`);
    next();
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// API Routes
app.use('/api/auth/login', strictLimiter); // Strict limit for login (Brute-force protection)
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/milestones', milestonesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/version', versionRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/hiring', strictLimiter, hiringRoutes); // Strict limit for hiring form (Spam protection)

// 404 handler
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        path: req.originalUrl,
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: err.message,
        });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            error: 'File too large',
        });
    }

    // Generic error response
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
});

// Start server
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Cracked Digital Backend API                          ║
║                                                           ║
║   Server running on: http://localhost:${PORT}               ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(10)}                       ║
║                                                           ║
║   API Endpoints:                                          ║
║   • GET  /api/health          - Health check              ║
║   • GET  /api/public/all      - All public data           ║
║   • GET  /api/version         - Cache version check       ║
║   • POST /api/auth/login      - Admin login               ║
║   • CRUD /api/events          - Events management         ║
║   • CRUD /api/stats           - Stats management          ║
║   • CRUD /api/testimonials    - Testimonials              ║
║   • CRUD /api/faqs            - FAQs                      ║
║   • CRUD /api/milestones      - Milestones                ║
║   • CRUD /api/team            - Team management           ║
║   • PUT  /api/settings        - Site settings             ║
║   • POST /api/upload          - Image upload              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
    });
}

export default app;
