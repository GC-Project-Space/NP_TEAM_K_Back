// config/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(' MongoDB 연결 성공');
    } catch (error) {
      console.error(' MongoDB 연결 실패:', error.message);
      process.exit(1);
    }
  };

module.exports = connectDB;