
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Menu, Send } from 'lucide-react';
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col backdrop-blur-sm">
        {/* Header */}
        <header className="flex items-center justify-between p-3 border-b border-gray-200/60 bg-white/90 backdrop-blur-md shadow-sm">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-7 h-7 rounded-lg" />
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MAKAB
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-100/80 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <span>{remainingMessages}/6 messages left</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={startNewChat}
              className="h-8 px-3"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Chat
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent via-gray-50/20 to-slate-50/40">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-14 h-14 rounded-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Hi! I'm Makab 👋
              </h2>
              <p className="text-gray-600 max-w-md">
                Your AI assistant created by Sajid for conversations and content creation! ✨
              </p>
              <div className="text-sm text-gray-500 bg-blue-50/80 border border-blue-100 rounded-lg p-3 backdrop-blur-sm">
                💬 {remainingMessages} messages remaining today
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

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200/60 bg-white/95 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={canSendMessage() ? "Message Makab..." : "Daily limit reached"}
              className="flex-1 border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm h-11"
              disabled={isLoading || !canSendMessage()}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading || !canSendMessage()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-4 shadow-md h-11"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          {!canSendMessage() && (
            <p className="text-center text-sm text-red-500 mt-2">
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
