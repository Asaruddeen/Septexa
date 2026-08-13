import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';  // Correct path
import { protect } from '../middleware/auth.js';  // Correct path

const router = express.Router();

// Admin Login - Simple hardcoded check
router.post('/login', async (req, res) => {
  console.log('📨 Admin login attempt:', req.body.email);
  console.log('📨 Request body:', req.body);
  
  try {
    const { email, password } = req.body;
    
    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'admin@septexa.com';
    const ADMIN_PASSWORD = 'Asar7741';

    // Validate credentials
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(401).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    if (email !== ADMIN_EMAIL) {
      console.log('❌ Invalid email:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid admin credentials' 
      });
    }

    if (password !== ADMIN_PASSWORD) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid admin credentials' 
      });
    }

    console.log('✅ Admin credentials verified for:', email);

    // Find or create admin user in database
    let user = await User.findOne({ email: ADMIN_EMAIL });
    
    if (!user) {
      console.log('📝 Creating admin user in database...');
      // Create admin user if doesn't exist
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
      
      user = await User.create({
        name: 'Admin User',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        lastLogin: new Date(),
      });
      console.log('✅ Admin user created:', user._id);
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      console.log('✅ Admin user found:', user._id);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret_key_12345',
      { expiresIn: '7d' }
    );

    console.log('✅ Admin login successful');

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      }
    });

  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login: ' + error.message
    });
  }
});

// Verify admin token
router.get('/verify', protect, async (req, res) => {
  console.log('🔍 Verifying admin token for:', req.user?.id);
  
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      console.log('❌ User not found:', req.user.id);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.role !== 'admin') {
      console.log('❌ User is not admin:', user.role);
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized as admin' 
      });
    }

    console.log('✅ Admin token verified for:', user.email);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      }
    });
  } catch (error) {
    console.error('❌ Verify admin error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Get all users (admin only)
router.get('/users', protect, async (req, res) => {
  console.log('📋 Fetching users by admin:', req.user?.id);
  
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'admin') {
      console.log('❌ Not authorized as admin');
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized as admin' 
      });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    console.log(`✅ Found ${users.length} users`);
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Get dashboard stats (admin only)
router.get('/stats', protect, async (req, res) => {
  console.log('📊 Fetching stats by admin:', req.user?.id);
  
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'admin') {
      console.log('❌ Not authorized as admin');
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized as admin' 
      });
    }

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });

    console.log('✅ Stats fetched:', { totalUsers, activeUsers, adminUsers, newUsersToday });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        newUsersToday,
      }
    });
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Delete user (admin only)
router.delete('/users/:id', protect, async (req, res) => {
  console.log('🗑️ Deleting user:', req.params.id, 'by admin:', req.user?.id);
  
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized as admin' 
      });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    console.log('✅ User deleted:', req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

export default router;