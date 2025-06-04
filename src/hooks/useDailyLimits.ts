
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
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      chatMessages: 0,
      toolGenerations: 0,
      lastReset: new Date().toDateString()
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

  const canSendMessage = () => limits.chatMessages < CHAT_LIMIT;
  const canUseTools = () => limits.toolGenerations < TOOLS_LIMIT;

  const incrementChatMessages = () => {
    if (canSendMessage()) {
      updateLimits({ ...limits, chatMessages: limits.chatMessages + 1 });
      return true;
    }
    return false;
  };

  const incrementToolGenerations = () => {
    if (canUseTools()) {
      updateLimits({ ...limits, toolGenerations: limits.toolGenerations + 1 });
      return true;
    }
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
