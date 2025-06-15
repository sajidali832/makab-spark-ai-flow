
import { Button } from '@/components/ui/button';
import { RotateCcw, Square, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

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
  onRegenerate?: () => void;
  onStop?: () => void;
}

const ChatMessage = ({ message, isCurrentlyThinking, onRegenerate, onStop }: ChatMessageProps) => {
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);

  const regenerateResponse = () => {
    if (onRegenerate) {
      onRegenerate();
      toast({
        title: "Regenerating...",
        description: "Creating a new response",
      });
    }
  };

  const stopResponse = () => {
    if (onStop) {
      onStop();
      toast({
        title: "Stopped",
        description: "Response generation stopped",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] sm:max-w-[80%]">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl rounded-br-md px-4 py-2 shadow-sm">
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start space-x-2">
      <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm relative">
        {/* Colorful blurred background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 via-purple-400/40 to-pink-400/40 rounded-full blur-sm"></div>
        <img src="/lovable-uploads/2abbf453-6761-4fd3-96ab-e66591ad66dc.png" alt="Makab" className="w-4 h-4 rounded-full relative z-10" />
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="max-w-[85%] sm:max-w-[80%] bg-white border border-purple-200 rounded-xl rounded-bl-md px-4 py-2 shadow-sm">
          {message.isThinking ? (
            <div className="flex items-center space-x-2 text-purple-600">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-xs">Thinking...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-purple-800 text-sm">{message.content}</p>
          )}
        </div>
        
        {!message.isThinking && (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className={`h-6 px-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 transition-colors duration-200 ${
                copySuccess ? 'text-green-600' : ''
              }`}
            >
              {copySuccess ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
            
            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-6 px-2 text-purple-600 hover:text-pink-500 hover:bg-pink-100 transition-colors duration-200"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
            
            {isCurrentlyThinking && (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopResponse}
                className="h-6 px-2 text-purple-600 hover:text-red-600 hover:bg-pink-100 transition-colors duration-200"
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
