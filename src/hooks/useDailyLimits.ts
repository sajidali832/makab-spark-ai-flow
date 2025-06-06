
import { useState, useEffect } from 'react';

interface DailyLimits {
  chatMessages: number;
  toolGenerations: number;
  lastReset: string;
}

const CHAT_LIMIT = 6;
const TOOLS_LIMIT = 3;

export const useDailyLimits = () => {
  const [limits, setLimits] = useState<DailyLimits>(() => {
    const stored = localStorage.getItem('makab_daily_limits');
    const today = new Date().toDateString();
    
    if (stored) {
      const parsedLimits = JSON.parse(stored);
      // Reset if it's a new day
      if (parsedLimits.lastReset !== today) {
        return {
          chatMessages: 0,
          toolGenerations: 0,
          lastReset: today
        };
      }
      return parsedLimits;
    }
    
    // New user - start with fresh limits
    return {
      chatMessages: 0,
      toolGenerations: 0,
      lastReset: today
    };
  });

  // Check if we need to reset limits (at midnight)
  useEffect(() => {
    const checkReset = () => {
      const today = new Date().toDateString();
      if (limits.lastReset !== today) {
        const newLimits = {
          chatMessages: 0,
          toolGenerations: 0,
          lastReset: today
        };
        setLimits(newLimits);
        localStorage.setItem('makab_daily_limits', JSON.stringify(newLimits));
      }
    };

    checkReset();
    
    // Check every minute for midnight reset
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, [limits.lastReset]);

  const updateLimits = (newLimits: DailyLimits) => {
    setLimits(newLimits);
    localStorage.setItem('makab_daily_limits', JSON.stringify(newLimits));
  };

  const canSendMessage = () => {
    console.log('Chat limit check:', limits.chatMessages, '<', CHAT_LIMIT);
    return limits.chatMessages < CHAT_LIMIT;
  };
  
  const canUseTools = () => {
    console.log('Tools limit check:', limits.toolGenerations, '<', TOOLS_LIMIT);
    return limits.toolGenerations < TOOLS_LIMIT;
  };

  const incrementChatMessages = () => {
    console.log('Incrementing chat messages, current:', limits.chatMessages);
    if (canSendMessage()) {
      const newLimits = { ...limits, chatMessages: limits.chatMessages + 1 };
      updateLimits(newLimits);
      console.log('Chat messages incremented to:', newLimits.chatMessages);
      return true;
    }
    console.log('Chat message limit reached');
    return false;
  };

  const incrementToolGenerations = () => {
    console.log('Incrementing tool generations, current:', limits.toolGenerations);
    if (canUseTools()) {
      const newLimits = { ...limits, toolGenerations: limits.toolGenerations + 1 };
      updateLimits(newLimits);
      console.log('Tool generations incremented to:', newLimits.toolGenerations);
      return true;
    }
    console.log('Tool generation limit reached');
    return false;
  };

  return {
    limits,
    canSendMessage,
    canUseTools,
    incrementChatMessages,
    incrementToolGenerations,
    remainingMessages: CHAT_LIMIT - limits.chatMessages,
    remainingGenerations: TOOLS_LIMIT - limits.toolGenerations
  };
};
