'use client';

import { useState } from 'react';
import Chat from '@/components/Chat';
import { ChatRoom } from '@/types/chat';

export default function ChatPage() {
  const [currentRoom, setCurrentRoom] = useState<ChatRoom>({
    id: '1',
    name: 'AI Assistant',
    type: 'ai',
    participants: ['user1'],
    messages: [
      {
        id: '1',
        content: 'Hello! How can I help you today?',
        sender: 'ai',
        timestamp: new Date(),
      },
    ],
  });

  const rooms: ChatRoom[] = [
    currentRoom,
    {
      id: '2',
      name: 'Group Chat',
      type: 'user',
      participants: ['user1', 'user2', 'user3'],
      messages: [
        {
          id: '1',
          content: 'Hey everyone!',
          sender: 'other-user',
          timestamp: new Date(),
          senderName: 'user2',
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Chat Rooms</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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