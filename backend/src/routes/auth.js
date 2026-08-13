import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { protect, generateToken } from '../middleware/auth.js';

const router = express.Router();

// ===== GOOGLE OAUTH STRATEGY =====
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if user exists with email
          const existingUser = await User.findOne({ email: profile.emails[0].value });

          if (existingUser) {
            // Link Google account to existing user
            existingUser.googleId = profile.id;
            existingUser.avatar = profile.photos?.[0]?.value || existingUser.avatar;
            await existingUser.save();
            user = existingUser;
          } else {
            // Create new user
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName || profile.name?.givenName || 'User',
              email: profile.emails[0].value,
              avatar: profile.photos?.[0]?.value || '',
              password: null,
            });
          }
        }

        user.lastLogin = new Date();
        await user.save();

        return done(null, user);
      } catch (error) {
        console.error('Google strategy error:', error);
        return done(error, null);
      }
    }
  )
);

// ===== AUTH ROUTES =====

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== GOOGLE OAUTH ROUTES =====

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      const user = req.user;

      // Redirect to frontend with token
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth-callback?token=${token}&user=${encodeURIComponent(
          JSON.stringify({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          })
        )}`
      );
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=google_auth_failed`);
    }
  }
);

export default router;
