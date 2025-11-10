
export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
}

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
}

export interface Subscription {
  crop: string;
  location: {
    lat: number;
    lon: number;
  };
  plantingDate?: string;
}
