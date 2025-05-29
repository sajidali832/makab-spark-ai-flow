
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isThinking?: boolean;
}

interface ChatMessageProps {
  message: Message;
  isCurrentlyThinking?: boolean;
}

const ChatMessage = ({ message, isCurrentlyThinking }: ChatMessageProps) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const regenerateResponse = () => {
    toast({
      title: "Regenerating...",
      description: "Creating a new response",
    });
  };

  const stopResponse = () => {
    toast({
      title: "Stopped",
      description: "Response generation stopped",
    });
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] sm:max-w-[80%] bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-br-md px-3 py-2 sm:px-4 sm:py-3 animate-fade-in">
          <p className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start space-x-2 sm:space-x-3 animate-fade-in">
      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <img src="/lovable-uploads/904df8c0-f8d1-4e1a-b7f5-274e6b80d61f.png" alt="Makab" className="w-4 h-4 sm:w-6 sm:h-6 rounded-full" />
      </div>
      
      <div className="flex-1 space-y-1 sm:space-y-2">
        <div className="max-w-[85%] sm:max-w-[80%] bg-gray-50 rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-3">
          {message.isThinking ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-xs sm:text-sm">Thinking...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-gray-800 text-sm sm:text-base">{message.content}</p>
          )}
        </div>
        
        {!message.isThinking && (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-6 px-2 sm:h-7 text-gray-500 hover:text-gray-700"
            >
              <Copy className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={regenerateResponse}
              className="h-6 px-2 sm:h-7 text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            
            {isCurrentlyThinking && (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopResponse}
                className="h-6 px-2 sm:h-7 text-gray-500 hover:text-gray-700"
              >
                <Square className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
