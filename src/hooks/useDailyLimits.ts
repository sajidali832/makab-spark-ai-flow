
import { useState, useEffect } from 'react';

interface DailyLimits {
  chatMessages: number;
  toolGenerations: number;
  lastReset: string;
}

const CHAT_LIMIT = 10;
const TOOLS_LIMIT = 6;

export const useDailyLimits = () => {
  const [limits, setLimits] = useState<DailyLimits>(() => {
    try {
      const stored = localStorage.getItem('makab_daily_limits');
      const today = new Date().toDateString();
      
      if (stored) {
        try {
          const parsedLimits = JSON.parse(stored);
          // Reset if it's a new day
          if (parsedLimits.lastReset !== today) {
            console.log('New day detected, resetting limits');
            return {
              chatMessages: 0,
              toolGenerations: 0,
              lastReset: today
            };
          }
          return parsedLimits;
        } catch (parseError) {
          console.error('Error parsing stored limits:', parseError);
          // If JSON parsing fails, start with fresh limits
          return {
            chatMessages: 0,
            toolGenerations: 0,
            lastReset: today
          };
        }
      }
      
      // New user - start with fresh limits
      console.log('No stored limits found, starting with fresh limits');
      return {
        chatMessages: 0,
        toolGenerations: 0,
        lastReset: today
      };
    } catch (error) {
      console.error('Error in useDailyLimits initialization:', error);
      // Failsafe default
      return {
        chatMessages: 0,
        toolGenerations: 0,
        lastReset: new Date().toDateString()
      };
    }
  });

  // Check if we need to reset limits (at midnight)
  useEffect(() => {
    const checkReset = () => {
      try {
        const today = new Date().toDateString();
        if (limits.lastReset !== today) {
          console.log('Day change detected in useEffect, resetting limits');
          const newLimits = {
            chatMessages: 0,
            toolGenerations: 0,
            lastReset: today
          };
          setLimits(newLimits);
          localStorage.setItem('makab_daily_limits', JSON.stringify(newLimits));
        }
      } catch (error) {
        console.error('Error checking for reset:', error);
      }
    };

    checkReset();
    
    // Check every minute for midnight reset
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, [limits.lastReset]);

  const updateLimits = (newLimits: DailyLimits) => {
    try {
      setLimits(newLimits);
      localStorage.setItem('makab_daily_limits', JSON.stringify(newLimits));
    } catch (error) {
      console.error('Error updating limits:', error);
    }
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
