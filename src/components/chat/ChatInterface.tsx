
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Menu, Send, Copy, RotateCcw, Square } from 'lucide-react';
import ChatMessage from './ChatMessage';
import Sidebar from './Sidebar';
import PWAInstallPrompt from '../PWAInstallPrompt';

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

  const simulateAIResponse = async (userMessage: string) => {
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
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // Replace with actual response
    const responses = [
      "I understand you're asking about this topic. Based on my analysis, here's what I can help you with:\n\n1. **Key Points**: Let me break this down for you\n2. **Detailed Analysis**: Looking at the various aspects\n3. **Recommendations**: Here's what I suggest\n\nWould you like me to elaborate on any of these points?",
      "That's a great question! Let me provide you with a comprehensive answer:\n\n**Overview**: This is an important topic that requires careful consideration.\n\n**My Analysis**: After processing your request, I can see several angles to approach this:\n- First consideration\n- Second important point\n- Third key aspect\n\nHow can I help you dive deeper into this?",
      "I've processed your query and here's my detailed response:\n\n**Understanding**: I can see what you're looking for\n**Solution**: Here's how I can help you achieve your goal\n**Next Steps**: Consider these options moving forward\n\nFeel free to ask any follow-up questions!"
    ];
    
    const actualResponse: Message = {
      id: messageId,
      content: responses[Math.floor(Math.random() * responses.length)],
      role: 'assistant',
      timestamp: new Date(),
      isThinking: false
    };
    
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? actualResponse : msg
    ));
    setCurrentThinkingId(null);
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

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    await simulateAIResponse(inputValue);
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
            <span className="font-semibold">Makab o1 Pro</span> - Fast Reasoning Model
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
