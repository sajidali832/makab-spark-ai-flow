
import { Button } from '@/components/ui/button';
import { RotateCcw, Square, Copy } from 'lucide-react';
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl rounded-br-md px-3 py-2 animate-fade-in">
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start space-x-2 animate-fade-in">
      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <img src="/lovable-uploads/904df8c0-f8d1-4e1a-b7f5-274e6b80d61f.png" alt="Makab" className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" />
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="max-w-[85%] sm:max-w-[80%] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl rounded-bl-md px-3 py-2 shadow-sm">
          {message.isThinking ? (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <div className="flex space-x-1">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-xs">Thinking...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm">{message.content}</p>
          )}
        </div>
        
        {!message.isThinking && (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-5 px-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Copy className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={regenerateResponse}
              className="h-5 px-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            
            {isCurrentlyThinking && (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopResponse}
                className="h-5 px-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
