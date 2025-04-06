'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic connection
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .limit(1);

        if (error) throw error;

        setConnectionStatus('Connected successfully!');
        setMessages(data || []);
      } catch (error: any) {
        setConnectionStatus(`Error: ${error?.message || 'Unknown error'}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="mb-4">
        <p className="font-semibold">Status:</p>
        <p className={connectionStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}>
          {connectionStatus}
        </p>
      </div>
      <div>
        <p className="font-semibold">Sample Messages:</p>
        <pre className="bg-gray-100 p-4 rounded mt-2">
          {JSON.stringify(messages, null, 2)}
        </pre>
      </div>
    </div>
  );
} 