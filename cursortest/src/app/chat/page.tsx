'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Chat from '@/components/Chat';
import { ChatRoom } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        // For now, we'll use a static group chat room
        const initialRooms: ChatRoom[] = [
          {
            id: '1',
            name: 'Group Chat',
            type: 'user',
            participants: ['user1', 'user2', 'user3'],
            messages: [],
          },
        ];

        setRooms(initialRooms);
      } catch (error) {
        console.error('Error loading rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadRooms();
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading chat room...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Chat Room</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {user?.is_anonymous ? 'Anonymous User' : 'Logged in user'}
            </span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{room.name}</h2>
              <Chat room={room} currentUser={user?.id || ''} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 