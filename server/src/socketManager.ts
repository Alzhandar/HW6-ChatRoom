import { Server as SocketIOServer } from 'socket.io';
import { saveMessage, getMessagesForRoom } from './controllers/chatController';
import { MessageData } from './types/chat';
import logger from './utils/logger';

interface User {
  username: string;
  room: string;
  typing: boolean;
}

const users: { [key: string]: User } = {};

export const registerSocketEvents = (io: SocketIOServer) => {
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on('join_room', async (room: string, username: string) => {
      socket.join(room);
      users[socket.id] = { username, room, typing: false };

      const messages = await getMessagesForRoom(room);
      socket.emit('room_history', messages);

      const joinMessage: MessageData = {
        room,
        username: 'System',
        message: `${username} has joined the chat.`,
        timestamp: new Date(),
      };
      io.to(room).emit('receive_message', joinMessage);

      const roomUsers = Object.values(users)
        .filter((user) => user.room === room)
        .map((user) => ({ username: user.username, typing: user.typing }));
      io.to(room).emit('update_users', roomUsers);
    });

    socket.on('send_message', async (data: MessageData) => {
      const message = await saveMessage(data);
      io.to(data.room).emit('receive_message', message);
    });

    socket.on('typing', (room: string) => {
      if (users[socket.id]) {
        users[socket.id].typing = true;
        const roomUsers = Object.values(users)
          .filter((user) => user.room === room)
          .map((user) => ({ username: user.username, typing: user.typing }));
        io.to(room).emit('update_users', roomUsers);
      }
    });

    socket.on('stop_typing', (room: string) => {
      if (users[socket.id]) {
        users[socket.id].typing = false;
        const roomUsers = Object.values(users)
          .filter((user) => user.room === room)
          .map((user) => ({ username: user.username, typing: user.typing }));
        io.to(room).emit('update_users', roomUsers);
      }
    });

    socket.on('disconnect', () => {
      const user = users[socket.id];
      if (user) {
        const { room, username } = user;
        delete users[socket.id];
        const roomUsers = Object.values(users)
          .filter((user) => user.room === room)
          .map((user) => ({ username: user.username, typing: user.typing }));
        io.to(room).emit('update_users', roomUsers);

        const leaveMessage: MessageData = {
          room,
          username: 'System',
          message: `${username} has left the chat.`,
          timestamp: new Date(),
        };
        io.to(room).emit('receive_message', leaveMessage);
      }
      logger.info('User disconnected');
    });
  });
};
