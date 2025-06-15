
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
          <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md border border-white/20 text-white rounded-xl rounded-br-md px-3 py-2 animate-fade-in shadow-glass">
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start space-x-2 animate-fade-in">
      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-glass backdrop-blur-sm border border-white/20">
        <img src="/lovable-uploads/904df8c0-f8d1-4e1a-b7f5-274e6b80d61f.png" alt="Makab" className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" />
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="max-w-[85%] sm:max-w-[80%] bg-white/15 backdrop-blur-xl border border-white/30 rounded-xl rounded-bl-md px-3 py-2 shadow-glass">
          {message.isThinking ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="flex space-x-1">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-xs">Thinking...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-gray-800 text-sm">{message.content}</p>
          )}
        </div>
        
        {!message.isThinking && (
          <div className="flex items-center space-x-1">
            <Button
              variant="glass"
              size="sm"
              onClick={copyToClipboard}
              className={`h-5 px-1 text-gray-600 hover:text-gray-800 transition-all duration-200 ${
                copySuccess ? 'text-green-600 scale-110' : ''
              } hover:animate-liquid-ripple`}
            >
              {copySuccess ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
            
            <Button
              variant="glass"
              size="sm"
              onClick={regenerateResponse}
              className="h-5 px-1 text-gray-600 hover:text-gray-800 hover:scale-110 transition-all duration-200 hover:animate-liquid-ripple"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            
            {isCurrentlyThinking && (
              <Button
                variant="glass"
                size="sm"
                onClick={stopResponse}
                className="h-5 px-1 text-gray-600 hover:text-red-600 hover:scale-110 transition-all duration-200 hover:animate-liquid-ripple"
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
