const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  // In development, prefer MONGO_URI_LOCAL; fall back to MONGO_URI.
  // In production (Render), only MONGO_URI (Atlas) is set.
  const isDevEnv = process.env.NODE_ENV !== 'production';
  const uri = isDevEnv
    ? (process.env.MONGO_URI_LOCAL || process.env.MONGO_URI)
    : process.env.MONGO_URI;

  if (!uri) {
    logger.error('No MongoDB URI found. Set MONGO_URI (production) or MONGO_URI_LOCAL (development) in your .env file.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    const dbType = isDevEnv && process.env.MONGO_URI_LOCAL ? 'Local' : 'Atlas (Cloud)';
    logger.info(`MongoDB Connected [${dbType}]: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;