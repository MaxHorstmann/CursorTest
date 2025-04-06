export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'other-user';
  timestamp: Date;
  senderName?: string;
};

export type ChatRoom = {
  id: string;
  name: string;
  type: 'ai' | 'user';
  participants: string[];
  messages: Message[];
}; 