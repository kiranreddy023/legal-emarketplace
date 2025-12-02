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
const mongoose = require('mongoose');

const connectDB = async (uri = process.env.MONGO_URI) => {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;