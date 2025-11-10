
import React from 'react';
import { SendIcon, MicrophoneIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  inputValue,
  onInputChange,
  isRecording,
  onToggleRecording,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={isRecording ? "Listening..." : "Ask a question about your farm..."}
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={onToggleRecording}
          className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors ${
            isRecording
              ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
          disabled={isLoading}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <MicrophoneIcon />
        </button>
        <button
          type="submit"
          className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
          disabled={isLoading || !inputValue.trim()}
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;