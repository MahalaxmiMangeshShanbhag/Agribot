
import React from 'react';
import type { ChatMessage } from '../types';
import { MessageAuthor } from '../types';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from './icons';

interface MessageProps {
  message: ChatMessage;
  onTogglePlay: (messageId: string, text: string) => void;
  speakingMessageId: string | null;
}

// Helper function to find URLs in text and wrap them in anchor tags
const linkify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const Message: React.FC<MessageProps> = ({ message, onTogglePlay, speakingMessageId }) => {
  const isUser = message.author === MessageAuthor.USER;
  const isBot = message.author === MessageAuthor.BOT;
  const isSpeaking = speakingMessageId === message.id;

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-green-600 text-white'
    : 'bg-white dark:bg-gray-700 dark:text-gray-200 text-gray-800';
  const authorText = isUser ? 'You' : 'Bot';
  const authorClasses = isUser ? 'text-right' : 'text-left';

  return (
    <div className={`mb-4 ${wrapperClasses}`}>
      <div className="w-full md:w-3/4 lg:w-2/3 flex items-end gap-2">
        {isBot && (
           <button
            onClick={() => onTogglePlay(message.id, message.text)}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={isSpeaking ? "Stop reading message" : "Read message aloud"}
          >
            {isSpeaking ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
          </button>
        )}
        <div className="w-full">
            <p className={`text-sm text-gray-500 dark:text-gray-400 mb-1 ${authorClasses}`}>{authorText}</p>
            <div className={`p-3 rounded-lg shadow-sm ${bubbleClasses}`}>
            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{linkify(message.text)}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Message;