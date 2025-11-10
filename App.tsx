
import React, { useState, useEffect, useRef } from 'react';
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
      id: 'initial-message',
      author: MessageAuthor.BOT,
      text: "Hello! I'm your farming assistant. How can I help you today? You can ask me about crop advice, weather, or market prices.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<NotificationPayload | null>(null);

  // State for voice features
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const recognitionRef = useRef<any>(null); // Using `any` for browser compatibility (webkitSpeechRecognition)

  // --- Speech-to-Text (STT) Setup ---
  useEffect(() => {
    // Fix: Cast window to `any` to access non-standard SpeechRecognition APIs.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    // Fix: Use `any` for event type because SpeechRecognitionEvent is not a standard DOM type.
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      setInputValue(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    // Fix: Use `any` for event type because SpeechRecognitionErrorEvent is not a standard DOM type.
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleToggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      // Stop any ongoing speech before starting to record
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      setInputValue('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // --- Text-to-Speech (TTS) Handler ---
  const handleTogglePlay = (messageId: string, text: string) => {
    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    } else {
      window.speechSynthesis.cancel(); // Stop any other speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => {
        console.error("Speech synthesis error");
        setSpeakingMessageId(null);
      };
      window.speechSynthesis.speak(utterance);
      setSpeakingMessageId(messageId);
    }
  };

  useEffect(() => {
    // This is a mock of a WebSocket notification from the server.
    // In a real app, you would establish a Socket.IO connection here.
    const mockNotificationTimer = setTimeout(() => {
      setActiveNotification({
        id: 'pest-alert-1',
        title: '⚠️ Pest Alert',
        message: 'Stem borer reported in nearby areas. Spray recommended within 24 hrs.',
      });
    }, 15000); // Show a demo notification after 15 seconds

    return () => clearTimeout(mockNotificationTimer);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Stop any ongoing speech or recording
    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
    if(isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
    }

    const userMessage: ChatMessage = { id: `user-${Date.now()}`, author: MessageAuthor.USER, text };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue(''); // Clear input after sending
    setIsLoading(true);

    try {
      const botResponseText = await getBotResponse(messages, text);
      const botMessage: ChatMessage = { id: `bot-${Date.now()}`, author: MessageAuthor.BOT, text: botResponseText };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
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
        <ChatWindow 
          messages={messages} 
          isLoading={isLoading} 
          onTogglePlay={handleTogglePlay}
          speakingMessageId={speakingMessageId}
        />
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          inputValue={inputValue}
          onInputChange={setInputValue}
          isRecording={isRecording}
          onToggleRecording={handleToggleRecording}
        />
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
