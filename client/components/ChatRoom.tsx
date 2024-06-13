import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

type Message = {
  room: string;
  username: string;
  message: string;
  timestamp: string;
};

type UserStatus = {
  username: string;
  typing: boolean;
};

let socket: Socket;

const ChatRoom = ({ username, room }: { username: string, room: string }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserStatus[]>([]);

  useEffect(() => {
    socket = io('http://localhost:5000');
    socket.emit('join_room', room, username);

    socket.on('receive_message', (data: Message) => {
      setMessageList((list) => [...list, data]);
    });

    socket.on('room_history', (messages: Message[]) => {
      setMessageList(messages);
    });

    socket.on('update_users', (users: UserStatus[]) => {
      setUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [room, username]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData: Message = {
        room: room,
        username: username,
        message: currentMessage,
        timestamp: new Date().toISOString(),
      };

      await socket.emit('send_message', messageData);
      setCurrentMessage("");
      socket.emit('stop_typing', room);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(event.target.value);
    if (event.target.value === '') {
      socket.emit('stop_typing', room);
    } else {
      socket.emit('typing', room);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white p-4 shadow-md">
        <h2 className="text-xl font-bold mb-4">Online Users</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index} className="mb-2 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {user.username} {user.typing && <span className="text-xs text-gray-500">    is typing...</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col w-3/4 h-full">
        <div className="flex items-center justify-between bg-gray-600 text-white p-4 shadow-md">
          <h1 className="text-xl font-bold">Chat: {room}</h1>
          <span className="italic">Account: {username}</span>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-auto">
          {messageList.map((messageContent, index) => (
            <div className={`message p-4 mb-4 rounded-lg shadow-md ${messageContent.username === username ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`} key={index}>
              <div className="font-medium">{messageContent.username}</div>
              <div className="text-sm">{messageContent.message}</div>
              <div className="text-xs text-right text-gray-500">{new Date(messageContent.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-gray-300">
          <div className="flex">
            <input
              type="text"
              value={currentMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="flex-grow p-2 rounded-l-md border border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-r-md">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;

