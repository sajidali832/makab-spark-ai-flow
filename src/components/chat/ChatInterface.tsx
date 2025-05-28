
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Menu, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import Sidebar from './Sidebar';
import PWAInstallPrompt from '../PWAInstallPrompt';
import { supabase } from '@/integrations/supabase/client';

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
  const [currentThinkingId, setCurrentThinkingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callChatAPI = async (conversationHistory: Message[]) => {
    const messageId = Date.now().toString();
    
    // Add thinking message
    setCurrentThinkingId(messageId);
    const thinkingMessage: Message = {
      id: messageId,
      content: 'Analyzing your request and formulating a comprehensive response...',
      role: 'assistant',
      timestamp: new Date(),
      isThinking: true
    };
    
    setMessages(prev => [...prev, thinkingMessage]);
    
    try {
      // Prepare messages for API (exclude thinking messages)
      const apiMessages = conversationHistory
        .filter(msg => !msg.isThinking)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { messages: apiMessages }
      });

      if (error) {
        throw new Error(error.message);
      }

      const actualResponse: Message = {
        id: messageId,
        content: data.generatedText,
        role: 'assistant',
        timestamp: new Date(),
        isThinking: false
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? actualResponse : msg
      ));
    } catch (error) {
      console.error('Error calling chat API:', error);
      const errorResponse: Message = {
        id: messageId,
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        isThinking: false
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? errorResponse : msg
      ));
    } finally {
      setCurrentThinkingId(null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    await callChatAPI(newMessages);
    setIsLoading(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentThinkingId(null);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/904df8c0-f8d1-4e1a-b7f5-274e6b80d61f.png" alt="Makab" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MAKAB
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={startNewChat}
              className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={startNewChat}
              className="sm:hidden"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Model Info */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <p className="text-sm text-center text-gray-700">
            <span className="font-semibold">Makab o1 Pro</span> - Fast Reasoning Model (Llama 3.3 8B)
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center">
                <img src="/lovable-uploads/904df8c0-f8d1-4e1a-b7f5-274e6b80d61f.png" alt="Makab" className="w-16 h-16 rounded-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">How can I help you today?</h2>
              <p className="text-gray-600 max-w-md">
                Ask me anything! I'm here to assist you with questions, generate content, or help with various tasks.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                isCurrentlyThinking={currentThinkingId === message.id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message Makab..."
              className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default ChatInterface;
