'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types/chat';

export default function TestPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        setMessages(data || []);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      }
    };

    loadMessages();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="p-4 bg-gray-100 rounded-lg">
            <p>{message.content}</p>
            <p className="text-sm text-gray-500">
              From: {message.user_id} at {new Date(message.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 