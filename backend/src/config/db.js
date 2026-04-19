// require('dotenv').config();
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@legalemarketplace1.itwfnlp.mongodb.net/?appName=LegalEMarketplace1`;

//   try {
//     await mongoose.connect(uri); // no extra options needed in Mongoose v7+
//     console.log('✅ MongoDB Atlas connected');
//   } catch (err) {
//     console.error('❌ MongoDB connection error:', err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'legal_emarketplace',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false // Set to console.log to see SQL queries
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized');
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };