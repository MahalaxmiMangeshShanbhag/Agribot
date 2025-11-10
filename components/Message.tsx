
import React from 'react';
import type { ChatMessage } from '../types';
import { MessageAuthor } from '../types';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-green-600 text-white'
    : 'bg-white dark:bg-gray-700 dark:text-gray-200 text-gray-800';
  const authorText = isUser ? 'You' : 'Bot';
  const authorClasses = isUser ? 'text-right' : 'text-left';

  return (
    <div className={`mb-4 ${wrapperClasses}`}>
      <div className="w-full md:w-3/4 lg:w-2/3">
        <p className={`text-sm text-gray-500 dark:text-gray-400 mb-1 ${authorClasses}`}>{authorText}</p>
        <div className={`p-3 rounded-lg shadow-sm ${bubbleClasses}`}>
          <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
