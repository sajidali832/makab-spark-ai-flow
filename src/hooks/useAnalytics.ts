
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
}

export const useAnalytics = () => {
  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_analytics')
        .insert({
          user_id: user.id,
          event_type: event.event_type,
          event_data: event.event_data || {}
        });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackPageView = (page: string) => {
    trackEvent({
      event_type: 'page_visit',
      event_data: { page }
    });
  };

  const trackToolUsage = (toolType: string, inputData?: any) => {
    trackEvent({
      event_type: 'tool_generation',
      event_data: { tool_type: toolType, input_data: inputData }
    });
  };

  const trackChatMessage = (messageType: 'user' | 'assistant', messageLength?: number) => {
    trackEvent({
      event_type: 'chat_message',
      event_data: { message_type: messageType, message_length: messageLength }
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackToolUsage,
    trackChatMessage
  };
};
