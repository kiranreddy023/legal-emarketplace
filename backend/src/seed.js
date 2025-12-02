require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

(async () => {
  await connectDB(); // uses MONGO_URI from .env

  // Clear existing users
  await User.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'Admin',
    email: 'kiran@kiran.com',
    phone: '9999999999',
    password: 'Kiran@123',
    role: 'ADMIN',
    // isVerified: true
  });

  console.log('✅ Seeded admin:', admin.email);
  process.exit(0);
})();