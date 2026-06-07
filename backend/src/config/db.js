const mongoose = require('mongoose');

let cached = global._mongoConn;
if (!cached) cached = global._mongoConn = { conn: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  cached.conn = await mongoose.connect(uri);
  console.log('MongoDB connected');
  return cached.conn;
}

module.exports = connectDB;
