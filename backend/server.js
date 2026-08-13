import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import connectDB from './config/database.js';
import authRoutes, { configureGoogleStrategy } from './routes/auth.js';
import toolRoutes from './routes/tools.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ===== SESSION CONFIGURATION (Required for OAuth) =====
app.use(session({
  secret: process.env.JWT_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
}));

// ===== CORS Configuration =====
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://septexa.onrender.com',
  'https://septexa.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth
configureGoogleStrategy(passport);

// ===== PASSPORT SERIALIZATION =====
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);
  next();
});

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Septexa API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.url);
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Frontend URL: ${process.env.FRONTEND_URL || 'https://septexa.vercel.app'}`);
  console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});