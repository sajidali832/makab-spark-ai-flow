
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw, Square, Eye } from 'lucide-react';
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
  const [showThinking, setShowThinking] = useState(false);
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
        <div className="max-w-[80%] bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-br-md px-4 py-3 animate-fade-in">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start space-x-3 animate-fade-in">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <img src="/lovable-uploads/904df8c0-f8d1-4e1a-b7f5-274e6b80d61f.png" alt="Makab" className="w-6 h-6 rounded-full" />
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="max-w-[80%] bg-gray-50 rounded-2xl rounded-bl-md px-4 py-3">
          {message.isThinking ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm">Makab is thinking...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-gray-800">{message.content}</p>
          )}
        </div>
        
        {!message.isThinking && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowThinking(!showThinking)}
              className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              What AI thought
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-7 px-2 text-gray-500 hover:text-gray-700"
            >
              <Copy className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={regenerateResponse}
              className="h-7 px-2 text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            
            {isCurrentlyThinking && (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopResponse}
                className="h-7 px-2 text-gray-500 hover:text-gray-700"
              >
                <Square className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        
        {showThinking && !message.isThinking && (
          <div className="max-w-[80%] bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-700">
            <p className="font-medium text-blue-800 mb-1">AI Reasoning Process:</p>
            <p>I analyzed your question by considering context, breaking down the key components, and formulating a comprehensive response that addresses your specific needs while providing actionable insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
