import { Router } from 'express';
import { getMessages, postMessage } from '../controllers/chatController';

const router = Router();

router.get('/:room', getMessages);
router.post('/', postMessage);

export default router;
