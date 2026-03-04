const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const { logger } = require('./src/utils/logger');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for now (adjust for prod)
    methods: ['GET', 'POST']
  }
});

// Make io accessible to our routers
app.set('io', io);

io.on('connection', (socket) => {
  logger.info(`New client connected: ${socket.id}`);

  socket.on('join_room', (room) => {
    socket.join(room);
    logger.info(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Valid client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});