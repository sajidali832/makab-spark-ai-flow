
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Send, Mic, MicOff, Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatMessage from './ChatMessage';
import { useToast } from '@/hooks/use-toast';
import { useVoiceInput } from '@/hooks/useVoiceInput';
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
  const [isThinking, setIsThinking] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
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

  // Updated function to use chat-completion edge function with OpenRouter
  const getAIResponse = async (input: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: {
          messages: [
            {
              role: 'user',
              content: input
            }
          ]
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (!data || !data.generatedText) {
        console.error('No content in response:', data);
        throw new Error('No response content received');
      }

      return data.generatedText;
    } catch (error) {
      console.error('AI Response error:', error);
      throw error;
    }
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
      const aiResponseMsg = await getAIResponse(inputValue);
      const aiResponse: Message = {
        id: (Date.now() + 2).toString(),
        content: aiResponseMsg,
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

  const handleRegenerateResponse = async (msgIndex: number) => {
    // Find the previous user message before this assistant message
    let prevUserMessage = null;
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        prevUserMessage = messages[i];
        break;
      }
    }
    if (!prevUserMessage) {
      toast({
        title: "Cannot regenerate",
        description: "No previous user message found.",
        variant: "destructive",
      });
      return;
    }

    setRegeneratingIndex(msgIndex);
    // Insert a 'thinking' message in place of this message
    setMessages((msgs) => {
      const updated = [...msgs];
      updated[msgIndex] = {
        ...updated[msgIndex],
        content: "",
        isThinking: true,
      };
      return updated;
    });

    try {
      const newAIResponse = await getAIResponse(prevUserMessage.content);
      setMessages((msgs) => {
        const updated = [...msgs];
        updated[msgIndex] = {
          ...updated[msgIndex],
          content: newAIResponse,
          isThinking: false,
        };
        return updated;
      });
      // Don't increment chat limit for regenerate
    } catch (err) {
      toast({
        title: "Regeneration failed",
        description: "Could not regenerate response.",
        variant: "destructive",
      });
    }
    setRegeneratingIndex(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        {/* --- HEADER: Smaller, soft white/blue, subtitle lower, blur effect --- */}
        <header
          className="relative z-10 select-none border-b border-blue-100 bg-white/60 backdrop-blur-lg shadow-sm"
          style={{ minHeight: '40px', height: '44px', paddingTop: 0, paddingBottom: 0 }}
        >
          {/* Blurry overlays - very soft blue/white, subtle */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-24px] left-[-18px] w-28 h-14 bg-blue-100/25 blur-2xl rounded-2xl opacity-30" />
            <div className="absolute top-1 right-[-18px] w-24 h-10 bg-purple-100/30 blur-xl rounded-2xl opacity-25" />
            <div className="absolute bottom-[-10px] left-8 w-20 h-6 bg-white/25 blur-lg rounded-full opacity-20" />
          </div>
          <div className="relative flex items-center justify-between px-3 py-0" style={{ minHeight: 0, height: '44px' }}>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-purple-500 hover:bg-blue-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-white/90 rounded-xl flex items-center justify-center ring-2 ring-blue-200/20 shadow"
                     style={{ backdropFilter: 'blur(4px)' }}>
                  <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-4 h-4 rounded" />
                </div>
                <div className="flex flex-col leading-none">
                  <h1 className="text-base font-extrabold bg-gradient-to-r from-blue-300 via-purple-300 to-blue-400 bg-clip-text text-transparent tracking-wide">
                    MAKAB
                  </h1>
                  <span className="text-[11px] font-medium text-blue-500 mt-[1px]" style={{ lineHeight: '13px', marginTop: '2px' }}>
                    AI Assistant
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="text-blue-600 border border-blue-100 hover:bg-blue-50 font-bold rounded-md"
                style={{
                  background: "linear-gradient(90deg,rgba(219,234,254,0.16),rgba(211,225,255,0.15) 60%)",
                  boxShadow: '0 2px 14px 0 rgba(180,200,255,0.06)'
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main chat area */}
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
            messages.map((message, idx) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentlyThinking={isThinking || regeneratingIndex === idx}
                onRegenerate={message.role === "assistant" && !message.isThinking
                  ? () => handleRegenerateResponse(idx)
                  : undefined
                }
                onStop={() => setIsThinking(false)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mobile message limit line */}
        <div className="sm:hidden px-4 py-2 bg-white/90 border-t border-blue-100">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 bg-pink-50 rounded-full px-3 py-1 border border-pink-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-purple-800 font-medium">{remainingMessages}/10 messages left</span>
            </div>
          </div>
        </div>

        {/* Input Area - fixed at VERY bottom, nice UI */}
        <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-white/95 via-white/70 to-transparent border-t-2 border-blue-100 shadow-lg lg:relative lg:shadow-none">
          <div className="max-w-4xl mx-auto px-2">
            <div className="bg-white border-2 border-blue-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition transition-shadow duration-200">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full resize-none bg-transparent border-none outline-none text-blue-800 placeholder-blue-300 text-sm leading-relaxed"
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
                        : 'bg-pink-50 border-pink-300 text-pink-600 hover:bg-pink-100'
                    }`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-pink-400 via-purple-400 to-purple-600 hover:from-pink-400 hover:to-purple-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
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
