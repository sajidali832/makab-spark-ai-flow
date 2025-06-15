import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Menu, Send, Sparkles, Mic, MicOff, Moon, Sun } from 'lucide-react';
import ChatMessage from './ChatMessage';
import Sidebar from './Sidebar';
import PWAInstallPrompt from '../PWAInstallPrompt';
import LimitExceededModal from '../LimitExceededModal';
import AnnouncementModal from '../AnnouncementModal';
import { useDailyLimits } from '@/hooks/useDailyLimits';
import { useVoiceInput } from '@/hooks/useVoiceInput';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const { canSendMessage, incrementChatMessages, remainingMessages } = useDailyLimits();
  const { isListening, transcript, startListening, stopListening, clearTranscript, isSupported } = useVoiceInput();

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

  const handleRegenerate = async (messageId: string) => {
    // Find the message to regenerate
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    // Get all messages up to the one before the message to regenerate
    const messageToRegenerate = messages[messageIndex];
    if (messageToRegenerate.role !== 'assistant') return;

    // Find the last user message before this assistant message
    const conversationHistory = messages.slice(0, messageIndex);
    
    // Remove the current assistant message
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    // Regenerate the response
    await callChatAPI(conversationHistory);
  };

  const handleStopGeneration = () => {
    setCurrentThinkingId(null);
    setIsLoading(false);
    // Remove any thinking messages
    setMessages(prev => prev.filter(msg => !msg.isThinking));
  };

  // Voice input effect
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  // Mobile keyboard handling
  useEffect(() => {
    const handleViewportChange = () => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        setTimeout(() => {
          inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };

    const handleResize = () => {
      if (window.visualViewport) {
        document.documentElement.style.setProperty('--viewport-height', `${window.visualViewport.height}px`);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
      handleResize();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
    };
  }, []);

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

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 safe-top safe-bottom transition-colors duration-300 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-breathing-glow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-breathing-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col backdrop-blur-sm relative z-10">
        {/* Compact Header with glass effect */}
        <header className="flex items-center justify-between p-2 sm:p-3 border-b border-white/20 bg-white/10 backdrop-blur-xl shadow-glass sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden h-7 w-7 p-0 rounded-lg"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-glass animate-glass-morph">
                <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-4 h-4 rounded-md" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MAKAB
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-700 bg-white/20 backdrop-blur-md rounded-full px-2 py-1 border border-white/30 shadow-glass">
              <Sparkles className="h-3 w-3 text-blue-500" />
              <span>{remainingMessages}/6</span>
            </div>
            <Button
              variant="frosted"
              size="sm"
              onClick={startNewChat}
              className="h-7 px-2 rounded-lg text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              New
            </Button>
          </div>
        </header>

        {/* Messages Area - with proper mobile spacing */}
        <div className="flex-1 overflow-y-auto pb-16 sm:pb-20 bg-gradient-to-b from-transparent via-gray-50/20 to-slate-50/40">
          <div className="p-2 sm:p-3 space-y-3 min-h-full">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-glass animate-breathing-glow backdrop-blur-sm">
                  <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Hi! I'm Makab 👋
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base max-w-sm leading-relaxed">
                    Your AI assistant created by Sajid for conversations and content creation! ✨
                  </p>
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-3 shadow-glass">
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-semibold text-gray-700">
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
                  onRegenerate={() => handleRegenerate(message.id)}
                  onStop={handleStopGeneration}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Fixed Input Area for Mobile with liquid glass styling */}
        <div className="fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto p-2 sm:p-3 border-t border-white/20 bg-white/10 backdrop-blur-xl safe-bottom z-20 shadow-glass">
          <form onSubmit={handleSendMessage} className="flex space-x-2 max-w-full">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={canSendMessage() ? "Message Makab..." : "Daily limit reached"}
              className="flex-1 border-white/30 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-lg bg-white/20 backdrop-blur-md shadow-glass h-9 sm:h-10 text-sm text-gray-800 placeholder-gray-500"
              disabled={isLoading || !canSendMessage()}
              style={{ fontSize: '16px' }}
            />
            
            {isSupported && (
              <Button
                type="button"
                variant={isListening ? "destructive" : "crystal"}
                onClick={handleVoiceToggle}
                disabled={isLoading || !canSendMessage()}
                className="h-9 sm:h-10 w-9 sm:w-10 rounded-lg shadow-glass min-w-[36px] flex-shrink-0"
              >
                {isListening ? <MicOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Mic className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
            )}
            
            <Button
              type="submit"
              variant="liquid"
              disabled={!inputValue.trim() || isLoading || !canSendMessage()}
              className="rounded-lg px-3 shadow-glass h-9 sm:h-10 min-w-[36px] flex-shrink-0"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </form>
          
          {!canSendMessage() && (
            <p className="text-center text-xs text-red-500 mt-1">
              Daily limit reached. Resets at midnight.
            </p>
          )}
          
          {isListening && (
            <p className="text-center text-xs text-blue-500 mt-1 animate-pulse">
              🎤 Listening... Speak now
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

      {/* Announcement Modal */}
      <AnnouncementModal />
    </div>
  );
};

export default ChatInterface;
