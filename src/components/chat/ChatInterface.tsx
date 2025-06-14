import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Menu, Send, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import Sidebar from './Sidebar';
import PWAInstallPrompt from '../PWAInstallPrompt';
import LimitExceededModal from '../LimitExceededModal';
import { useDailyLimits } from '@/hooks/useDailyLimits';
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const { canSendMessage, incrementChatMessages, remainingMessages } = useDailyLimits();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMessageToDatabase = async (message: Message, convId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('makab_user') || '{}');
      if (user.id) {
        await supabase.from('chat_messages').insert({
          conversation_id: convId,
          user_id: user.id,
          content: message.content,
          role: message.role
        });
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('makab_user') || '{}');
      if (user.id) {
        const { data, error } = await supabase.from('chat_conversations').insert({
          user_id: user.id,
          title: 'New Chat'
        }).select().single();

        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
    return null;
  };

  const callChatAPI = async (conversationHistory: Message[]) => {
    const messageId = Date.now().toString();
    
    // Add thinking message
    setCurrentThinkingId(messageId);
    const thinkingMessage: Message = {
      id: messageId,
      content: 'Let me think about this... 🤔',
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

      // Check if user is asking about the creator/CEO
      const userMessage = conversationHistory[conversationHistory.length - 1]?.content.toLowerCase() || '';
      const isAskingAboutCreator = userMessage.includes('who built') || 
                                   userMessage.includes('who created') || 
                                   userMessage.includes('who made') || 
                                   userMessage.includes('ceo') || 
                                   userMessage.includes('founder') || 
                                   userMessage.includes('owner') ||
                                   userMessage.includes('developer');

      let responseText = '';
      
      if (isAskingAboutCreator) {
        responseText = "I was created by Sajid, who is the CEO and founder of this platform. He built the first version of Makab AI and continues to lead the development with his talented team. Sajid had the vision to make AI accessible and helpful for everyone, and that's exactly what we've achieved here! 🚀";
      } else {
        const { data, error } = await supabase.functions.invoke('chat-completion', {
          body: { messages: apiMessages }
        });

        if (error) {
          throw new Error(error.message);
        }

        responseText = data.generatedText;
      }

      const actualResponse: Message = {
        id: messageId,
        content: responseText,
        role: 'assistant',
        timestamp: new Date(),
        isThinking: false
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? actualResponse : msg
      ));

      // Save to database if we have a conversation
      if (conversationId) {
        await saveMessageToDatabase(actualResponse, conversationId);
      }
    } catch (error) {
      console.error('Error calling chat API:', error);
      const errorResponse: Message = {
        id: messageId,
        content: 'Oops! Something went wrong 😅 Could you try asking that again? I promise I\'ll do better! 💪',
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

    // Check daily limit
    if (!canSendMessage()) {
      setLimitModalOpen(true);
      return;
    }

    // Increment the usage count
    if (!incrementChatMessages()) {
      setLimitModalOpen(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    // Create conversation if first message
    let convId = conversationId;
    if (!convId && messages.length === 0) {
      convId = await createNewConversation();
      setConversationId(convId);
    }

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    // Save user message to database
    if (convId) {
      await saveMessageToDatabase(userMessage, convId);
    }

    await callChatAPI(newMessages);
    setIsLoading(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentThinkingId(null);
    setConversationId(null);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 safe-top safe-bottom">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col backdrop-blur-sm relative">
        {/* Enhanced Header */}
        <header className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200/60 bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden h-9 w-9 p-0 rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-6 h-6 rounded-lg" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MAKAB
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-gray-100/80 rounded-full px-3 py-2 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-blue-500" />
              <span className="hidden sm:inline">{remainingMessages}/6 messages left</span>
              <span className="sm:hidden">{remainingMessages}/6</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={startNewChat}
              className="h-9 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">New Chat</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </header>

        {/* Messages Area - with proper mobile spacing */}
        <div className="flex-1 overflow-y-auto pb-20 sm:pb-24 bg-gradient-to-b from-transparent via-gray-50/20 to-slate-50/40">
          <div className="p-3 sm:p-4 space-y-4 min-h-full">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                  <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                    Hi! I'm Makab 👋
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg max-w-md leading-relaxed">
                    Your AI assistant created by Sajid for conversations and content creation! ✨
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        💬 {remainingMessages} messages remaining today
                      </span>
                    </div>
                  </div>
                </div>
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
        </div>

        {/* Fixed Input Area for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto p-3 sm:p-4 border-t border-gray-200/60 bg-white/95 backdrop-blur-md safe-bottom z-20">
          <form onSubmit={handleSendMessage} className="flex space-x-2 sm:space-x-3 max-w-full">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={canSendMessage() ? "Message Makab..." : "Daily limit reached"}
              className="flex-1 border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-sm shadow-sm h-11 sm:h-12 text-sm sm:text-base"
              disabled={isLoading || !canSendMessage()}
              style={{ fontSize: '16px' }}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading || !canSendMessage()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl sm:rounded-2xl px-3 sm:px-4 shadow-md h-11 sm:h-12 min-w-[44px] sm:min-w-[48px] flex-shrink-0"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </form>
          {!canSendMessage() && (
            <p className="text-center text-xs sm:text-sm text-red-500 mt-2">
              Daily limit reached. Resets at midnight.
            </p>
          )}
        </div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Limit Exceeded Modal */}
      <LimitExceededModal 
        isOpen={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        type="chat"
      />
    </div>
  );
};

export default ChatInterface;
