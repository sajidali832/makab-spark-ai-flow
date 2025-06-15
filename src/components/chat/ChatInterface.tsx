
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Send, Mic, MicOff, Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatMessage from './ChatMessage';
import { useToast } from '@/hooks/use-toast';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useDailyLimits } from '@/hooks/useDailyLimits';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isThinking?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isListening, startListening, stopListening } = useVoiceInput();
  const { canSendMessage, incrementChatMessages, remainingMessages } = useDailyLimits();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setIsLoading(false);
    setIsThinking(false);
    toast({
      title: "New Chat Started",
      description: "You can start fresh conversation now!",
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    if (!canSendMessage()) {
      toast({
        title: "Daily limit reached",
        description: "You've reached your daily message limit. Try again tomorrow!",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsThinking(true);

    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isThinking: true,
    };

    setMessages(prev => [...prev, thinkingMessage]);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse: Message = {
        id: (Date.now() + 2).toString(),
        content: `I understand you're asking about: "${inputValue}". I'm here to help you with conversations and content creation! How can I assist you further?`,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => prev.filter(msg => !msg.isThinking).concat([aiResponse]));
      incrementChatMessages();
      
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setMessages(prev => prev.filter(msg => !msg.isThinking));
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-white hover:bg-white/20"
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-5 h-5 rounded" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">MAKAB</h1>
                  <p className="text-xs text-white/80">AI Assistant</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Message Limit Display */}
              <div className="hidden sm:flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-white font-medium">{remainingMessages}/10</span>
              </div>

              {/* New Chat Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="text-white hover:bg-white/20 border border-white/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">New Chat</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 sm:pb-20">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <img src="/lovable-uploads/904df8c0-f8d1-4e1a-b7f5-274e6b80d61f.png" alt="Makab" className="w-12 h-12 rounded-full" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">Hi! I'm Makab 👋</h2>
                <p className="text-gray-600 max-w-md">
                  Your AI assistant created by Sajid for conversations and content creation! 🤖
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg px-4 py-2 border border-blue-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">{remainingMessages} messages remaining today</span>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentlyThinking={isThinking}
                onRegenerate={() => {}}
                onStop={() => setIsThinking(false)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mobile Message Limit - Show on small screens */}
        <div className="sm:hidden px-4 py-2 bg-white border-t border-gray-200">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 bg-blue-50 rounded-full px-3 py-1 border border-blue-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 font-medium">{remainingMessages}/10 messages left</span>
            </div>
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg lg:relative lg:shadow-none">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full resize-none bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-sm leading-relaxed"
                    rows={1}
                    style={{ minHeight: '24px', maxHeight: '120px' }}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceToggle}
                    className={`rounded-xl border-2 transition-colors duration-200 ${
                      isListening 
                        ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' 
                        : 'bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
