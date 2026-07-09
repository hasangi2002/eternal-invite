const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.status(200).json({
    success: true,
    message: 'Eternal Invite API is running',
    dbState: states[mongoose.connection.readyState] || 'unknown',
  });
});

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log('──────────────────────────────────────────');
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`🌐 Listening on http://localhost:${PORT}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/v1/health`);
    console.log('──────────────────────────────────────────');
  });

  process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Promise Rejection:', reason);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
  });
};

startServer();