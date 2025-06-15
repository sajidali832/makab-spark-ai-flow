
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Send, Mic, MicOff, Plus, Settings, User, MessageSquare } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatMessage from './ChatMessage';
import { useToast } from '@/hooks/use-toast';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useDailyLimits } from '@/hooks/useDailyLimits';
import { useNavigate } from 'react-router-dom';

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
  const { canSendMessage, incrementChatMessages } = useDailyLimits();
  const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        {/* Enhanced Navigation Header */}
        <header className="bg-white/20 backdrop-blur-xl border-b border-white/30 px-6 py-6 shadow-glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="crystal"
                size="lg"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden h-16 w-16 rounded-3xl shadow-glass hover:shadow-xl transition-all duration-300 backdrop-blur-xl border-2 border-white/30"
              >
                <Menu className="h-8 w-8" />
              </Button>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-glass backdrop-blur-xl border-2 border-white/20">
                  <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-10 h-10 rounded-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MAKAB
                  </h1>
                  <p className="text-base text-gray-600 font-medium">AI Assistant</p>
                </div>
              </div>
            </div>

            {/* Enhanced Navigation Icons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="frosted"
                size="lg"
                onClick={() => navigate('/chat')}
                className="h-16 w-16 rounded-3xl shadow-glass hover:shadow-xl transition-all duration-300 backdrop-blur-xl border-2 border-white/30"
              >
                <MessageSquare className="h-8 w-8" />
              </Button>
              
              <Button
                variant="frosted"
                size="lg"
                onClick={() => navigate('/profile')}
                className="h-16 w-16 rounded-3xl shadow-glass hover:shadow-xl transition-all duration-300 backdrop-blur-xl border-2 border-white/30"
              >
                <User className="h-8 w-8" />
              </Button>
              
              <Button
                variant="frosted"
                size="lg"
                onClick={() => navigate('/tools')}
                className="h-16 w-16 rounded-3xl shadow-glass hover:shadow-xl transition-all duration-300 backdrop-blur-xl border-2 border-white/30"
              >
                <Settings className="h-8 w-8" />
              </Button>
              
              <Button
                variant="liquid"
                size="lg"
                className="h-16 px-8 rounded-3xl shadow-glass hover:shadow-xl transition-all duration-300 backdrop-blur-xl border-2 border-white/20"
              >
                <Plus className="h-6 w-6 mr-3" />
                <span className="text-lg font-semibold">New Chat</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-breathing-glow">
                <img src="/lovable-uploads/904df8c0-f8d1-4e1a-b7f5-274e6b80d61f.png" alt="Makab" className="w-16 h-16 rounded-2xl" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-gray-800">Hi! I'm Makab 👋</h2>
                <p className="text-gray-600 max-w-md">
                  Your AI assistant created by Sajid for conversations and content creation! 🤖
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl px-6 py-4 shadow-glass">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-700 font-medium">10 messages remaining today</span>
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

        {/* Enhanced Input Area */}
        <div className="p-4 bg-white/10 backdrop-blur-xl border-t border-white/20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-glass p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1 min-h-[50px] max-h-32">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full h-full resize-none bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-base leading-relaxed"
                    rows={1}
                    style={{ minHeight: '50px' }}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="frosted"
                    size="lg"
                    onClick={handleVoiceToggle}
                    className={`h-12 w-12 rounded-2xl shadow-lg transition-all duration-300 ${
                      isListening 
                        ? 'bg-red-500/20 border-red-400/40 text-red-600 animate-pulse-mic' 
                        : 'hover:shadow-xl'
                    }`}
                  >
                    {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>
                  
                  <Button
                    variant="liquid"
                    size="lg"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="h-12 w-12 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Send className="h-6 w-6" />
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
