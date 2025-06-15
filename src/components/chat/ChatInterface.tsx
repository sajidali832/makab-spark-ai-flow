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

  const getAIResponse = async (input: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `I understand you're asking about: "${input}". I'm here to help you with conversations and content creation! How can I assist you further?`;
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
        {/* Vibrant Neon Header with abstract glowing shapes */}
        <header className="relative z-10 overflow-hidden select-none border-b border-purple-200">
          {/* Glassmorphism liquid shapes and flowing neon gradients */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Neon blue abstract blob */}
            <div className="absolute top-[-60px] left-[-80px] w-64 h-64 bg-cyan-400/70 blur-3xl rounded-[60%] rotate-12 animate-[glass-morph_11s_ease-in-out_infinite] opacity-90 z-0" />
            {/* Neon pink flowing shape */}
            <div className="absolute top-[10px] right-[-80px] w-80 h-52 bg-pink-500/50 blur-2xl rounded-tl-3xl rounded-br-[80px] rotate-[50deg] opacity-80 animate-[gradient-flow_14s_ease_infinite]" />
            {/* Cyber green glowing oval */}
            <div className="absolute bottom-[-60px] left-[60px] w-40 h-20 bg-green-400/50 blur-2xl rounded-full opacity-70 animate-pulse" />
            {/* Purple glassy oval with soft glow */}
            <div className="absolute bottom-0 right-[-70px] w-52 h-32 bg-purple-500/60 blur-[50px] rounded-tl-[60%] rounded-br-[80%] opacity-75 animate-[glass-morph_17s_ease-in-out_infinite]" />
            {/* Soft white reflection bar */}
            <div className="absolute left-1/2 bottom-0 w-3/5 h-7 bg-white/40 blur-md rounded-full -translate-x-1/2 opacity-30" />
          </div>

          <div className="relative flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-purple-500 hover:bg-purple-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-fuchsia-400 to-purple-600 rounded-xl flex items-center justify-center ring-4 ring-green-400/40 shadow-[0_4px_32px_0_rgba(80,255,204,0.25)]">
                  <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-6 h-6 rounded" />
                </div>
                <div>
                  <h1 className="text-[1.45rem] font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(120,255,255,0.38)]">
                    MAKAB
                  </h1>
                  <span className="bg-gradient-to-r from-green-400 via-purple-300 to-pink-400 bg-clip-text text-xs font-bold text-transparent tracking-wider glow">
                    AI Assistant
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 bg-white/60 rounded-full px-3 py-1 border border-purple-200 shadow backdrop-blur-md">
                <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_2px_#22d3ee88]" />
                <span className="text-sm text-purple-700 font-semibold tracking-widest">{remainingMessages}/10</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="text-purple-700 bg-gradient-to-br from-fuchsia-400 via-cyan-400 to-blue-400 border border-purple-100 hover:from-pink-400 hover:to-purple-700 hover:bg-purple-50 font-bold tracking-wide ring-2 ring-green-300/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">New Chat</span>
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
        <div className="sm:hidden px-4 py-2 bg-white/90 border-t border-purple-100">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 bg-pink-50 rounded-full px-3 py-1 border border-pink-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-purple-800 font-medium">{remainingMessages}/10 messages left</span>
            </div>
          </div>
        </div>

        {/* Input Area - fixed at VERY bottom, nice UI */}
        <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-white/95 via-white/70 to-transparent border-t-2 border-purple-100 shadow-lg lg:relative lg:shadow-none">
          <div className="max-w-4xl mx-auto px-2">
            <div className="bg-white border-2 border-purple-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition transition-shadow duration-200">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full resize-none bg-transparent border-none outline-none text-purple-800 placeholder-purple-300 text-sm leading-relaxed"
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
