export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'other-user';
  timestamp: Date;
  sender_name?: string;
  room_id: string;
  user_id: string;
  created_at: string;
};

export type ChatRoom = {
  id: string;
  name: string;
  type: 'ai' | 'user';
  participants: string[];
  messages: Message[];
}; 