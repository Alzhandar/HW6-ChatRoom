import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './db';
import config from './config/config';
import chatRoutes from './routes/chatRoutes';
import { registerSocketEvents } from './socketManager';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

registerSocketEvents(io);

server.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
