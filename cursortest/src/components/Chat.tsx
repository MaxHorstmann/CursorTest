/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, ChatRoom } from '@/types/chat';
import { supabase } from '@/lib/supabase';

interface ChatProps {
  room: ChatRoom;
  currentUser: string;
}

interface SupabasePayload {
  new: Message;
  old: Message;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  commit_timestamp: string;
}

export default function Chat({ room, currentUser }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(room.messages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) {
      setError('User not authenticated');
      return;
    }

    if (!supabase) {
      setError('Supabase client not initialized');
      return;
    }

    // Subscribe to new messages
    const channel = supabase
      .channel(`room:${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${room.id}`,
        } as const,
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    // Load existing messages
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', room.id)
          .order('timestamp', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          setError(`Error loading messages: ${error.message}`);
          return;
        }

        setMessages(data || []);
      } catch (error: any) {
        console.error('Unexpected error:', error);
        setError(`Unexpected error: ${error?.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [room.id, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const message = {
        content: newMessage,
        room_id: room.id,
        user_id: currentUser,
        sender: 'user',
      };

      console.log('Sending message:', message);
      const { error } = await supabase.from('messages').insert([message]);

      if (error) {
        console.error('Supabase error:', error);
        setError(`Error sending message: ${error.message}`);
        return;
      }

      setNewMessage('');
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setError(`Unexpected error: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">{room.name}</h2>
        <p className="text-sm text-gray-500">
          Chatting with {room.participants.filter(p => p !== currentUser).join(', ')}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.user_id === currentUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.user_id === currentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.user_id === currentUser ? 'You' : 'Anonymous User'}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
} 