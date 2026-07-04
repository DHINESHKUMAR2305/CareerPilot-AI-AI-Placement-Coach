import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/careerpilot')
  .then(async () => {
    const users = await User.find({}).sort({ createdAt: -1 });
    console.log('Users in DB:', users.map(u => u.email));
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
