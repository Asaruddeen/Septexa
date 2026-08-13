// backend/src/scripts/createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Asar7741', salt);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@septexa.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@septexa.com');
    console.log('🔑 Password: Asar7741');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();