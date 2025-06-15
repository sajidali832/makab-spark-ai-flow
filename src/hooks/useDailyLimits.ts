
import { useState, useEffect } from 'react';

interface DailyLimits {
  chatMessages: number;
  toolGenerations: number;
  lastReset: string;
}

const CHAT_LIMIT = 10;  // Updated from 6 to 10
const TOOLS_LIMIT = 6;  // Updated from 3 to 6

export const useDailyLimits = () => {
  const [limits, setLimits] = useState<DailyLimits>(() => {
    try {
      // Get current user from localStorage
      const user = localStorage.getItem('makab_user');
      const userId = user ? JSON.parse(user).id : null;
      
      if (!userId) {
        // No user logged in, return default limits
        return {
          chatMessages: 0,
          toolGenerations: 0,
          lastReset: new Date().toDateString()
        };
      }

      // Use user-specific key for limits
      const userLimitsKey = `makab_daily_limits_${userId}`;
      const stored = localStorage.getItem(userLimitsKey);
      const today = new Date().toDateString();
      
      if (stored) {
        try {
          const parsedLimits = JSON.parse(stored);
          // Reset if it's a new day
          if (parsedLimits.lastReset !== today) {
            console.log('New day detected, resetting limits for user:', userId);
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
      console.log('No stored limits found for user, starting with fresh limits:', userId);
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
          
          // Save to user-specific key
          const user = localStorage.getItem('makab_user');
          const userId = user ? JSON.parse(user).id : null;
          if (userId) {
            const userLimitsKey = `makab_daily_limits_${userId}`;
            localStorage.setItem(userLimitsKey, JSON.stringify(newLimits));
          }
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
      
      // Save to user-specific key
      const user = localStorage.getItem('makab_user');
      const userId = user ? JSON.parse(user).id : null;
      if (userId) {
        const userLimitsKey = `makab_daily_limits_${userId}`;
        localStorage.setItem(userLimitsKey, JSON.stringify(newLimits));
      }
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
