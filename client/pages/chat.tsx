import { useRouter } from 'next/router';
import ChatRoom from '../components/ChatRoom';

const Chat = () => {
  const router = useRouter();
  const { username, room } = router.query;
  return (username && room) ? (
    <ChatRoom username={username as string} room={room as string} />
  ) : (
    <div>Loading...</div>  
  );
};

export default Chat;
