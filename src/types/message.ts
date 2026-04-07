export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  orderId?: string;
  orderTitle?: string;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  role: 'manufacturer' | 'workshop';
  avatar?: string;
}
