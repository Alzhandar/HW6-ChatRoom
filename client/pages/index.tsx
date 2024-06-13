import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const router = useRouter();

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      router.push({
        pathname: '/chat',
        query: { username, room },
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-8">Join a Room</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={joinRoom}
          className="w-full bg-gray-600 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg"
        >
          Join A Room
        </button>
      </div>
    </div>
  );
}
