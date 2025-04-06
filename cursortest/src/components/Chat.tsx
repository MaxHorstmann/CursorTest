'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, ChatRoom } from '@/types/chat';

interface ChatProps {
  room: ChatRoom;
  currentUser: string;
}

export default function Chat({ room, currentUser }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(room.messages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      senderName: currentUser,
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // TODO: Implement actual message sending to backend
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">{room.name}</h2>
        <p className="text-sm text-gray-500">
          {room.type === 'ai' ? 'AI Chat' : `Chat with ${room.participants.filter(p => p !== currentUser).join(', ')}`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.sender === 'ai'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-green-500 text-white'
              }`}
            >
              {message.sender !== 'user' && (
                <div className="text-xs font-semibold mb-1">
                  {message.senderName || (message.sender === 'ai' ? 'AI Assistant' : 'Other User')}
                </div>
              )}
              <p>{message.content}</p>
              <div className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 