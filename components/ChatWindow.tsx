
import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import Message from './Message';
import { MessageAuthor } from '../types';


interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onTogglePlay: (messageId: string, text: string) => void;
  speakingMessageId: string | null;
}

const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
        <div className="w-full md:w-3/4 lg:w-2/3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bot</p>
            <div className="p-3 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Typing</span>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                </div>
            </div>
        </div>
    </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onTogglePlay, speakingMessageId }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} onTogglePlay={onTogglePlay} speakingMessageId={speakingMessageId} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatWindow;