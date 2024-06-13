import { Request, Response } from 'express';
import Message from '../models/message.model';
import { MessageData } from '../types/chat';
import logger from '../utils/logger';

export const getMessages = async (req: Request, res: Response) => {
  const room = req.params.room;
  try {
    const messages = await Message.find({ room }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    logger.error('Error fetching messages:', error);
    res.status(500).send('Server error');
  }
};

export const postMessage = async (req: Request, res: Response) => {
  const data: MessageData = req.body;
  try {
    const newMessage = new Message(data);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    logger.error('Error saving message:', error);
    res.status(500).send('Server error');
  }
};

export const saveMessage = async (data: MessageData) => {
  try {
    const newMessage = new Message(data);
    await newMessage.save();
    return newMessage;
  } catch (error) {
    logger.error('Error saving message:', error);
    throw error;
  }
};

export const getMessagesForRoom = async (room: string) => {
  try {
    const messages = await Message.find({ room }).sort({ timestamp: 1 });
    return messages;
  } catch (error) {
    logger.error('Error fetching messages:', error);
    throw error;
  }
};
