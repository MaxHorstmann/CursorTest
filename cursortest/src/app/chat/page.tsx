'use client';

import { useState, useEffect } from 'react';
import Chat from '@/components/Chat';
import { ChatRoom } from '@/types/chat';
import { supabase } from '@/lib/supabase';

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

    loadRooms();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading chat room...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Chat Room</h1>
        <div className="max-w-4xl mx-auto">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{room.name}</h2>
              <Chat room={room} currentUser="user1" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 