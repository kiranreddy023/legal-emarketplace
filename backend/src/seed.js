require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');
const User = require('./models/User');

// Import all models to register them
require('./models/Provider');
require('./models/Booking');
require('./models/Review');
require('./models/Incentive');

(async () => {
  await connectDB(); // Initialize database and sync models

  // Clear existing users
  await User.destroy({ where: {} });

  // Create admin user
  const admin = await User.create({
    name: 'Admin',
    email: 'kiran@kiran.com',
    phone: '9999999999',
    password: 'Kiran@123',
    role: 'ADMIN'
  });

  console.log('✅ Seeded admin:', admin.email);
  process.exit(0);
})();