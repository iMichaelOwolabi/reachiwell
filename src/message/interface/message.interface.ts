export interface MessageInterface {
  conversationId: string;
  senderId: string;
  recipientId?: string;
  message: string;
}
