
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import SubscribeModal from './components/SubscribeModal';
import NotificationToast from './components/NotificationToast';
import type { ChatMessage, NotificationPayload, Subscription } from './types';
import { MessageAuthor } from './types';
import { getBotResponse } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      author: MessageAuthor.BOT,
      text: "Hello! I'm your farming assistant. How can I help you today? You can ask me about crop advice, weather, or market prices.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<NotificationPayload | null>(null);

  useEffect(() => {
    // This is a mock of a WebSocket notification from the server.
    // In a real app, you would establish a Socket.IO connection here.
    const mockNotificationTimer = setTimeout(() => {
      setActiveNotification({
        id: '1',
        title: 'Weather Alert',
        message: 'Heavy rain is expected in your area tomorrow. Consider delaying pesticide application.',
      });
    }, 15000); // Show a demo notification after 15 seconds

    return () => clearTimeout(mockNotificationTimer);
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = { author: MessageAuthor.USER, text };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const botResponseText = await getBotResponse(messages, text);
      const botMessage: ChatMessage = { author: MessageAuthor.BOT, text: botResponseText };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        author: MessageAuthor.BOT,
        text: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = (subscription: Subscription) => {
    console.log('New subscription (mocked):', subscription);
    // In a real app, this would make a POST request to the `/subscribe` endpoint.
    setIsModalOpen(false);
    setActiveNotification({
        id: 'sub1',
        title: 'Subscription Successful!',
        message: `You've subscribed to alerts for ${subscription.crop}.`
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans">
      <Header onSubscribeClick={() => setIsModalOpen(true)} />
      <main className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
      <SubscribeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubscribe={handleSubscribe}
      />
      <NotificationToast
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
      />
    </div>
  );
};

export default App;
