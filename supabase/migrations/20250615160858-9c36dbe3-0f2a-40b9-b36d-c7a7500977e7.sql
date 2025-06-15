
-- Create table to track user analytics
CREATE TABLE public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'chat_message', 'tool_generation', 'page_visit'
  event_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX idx_user_analytics_user_id_created_at ON public.user_analytics(user_id, created_at DESC);
CREATE INDEX idx_user_analytics_event_type ON public.user_analytics(event_type);

-- Add RLS policies
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analytics" 
  ON public.user_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics" 
  ON public.user_analytics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create a view for daily usage summary
CREATE OR REPLACE VIEW public.daily_usage_summary AS
SELECT 
  user_id,
  DATE(created_at) as usage_date,
  event_type,
  COUNT(*) as event_count
FROM public.user_analytics
GROUP BY user_id, DATE(created_at), event_type
ORDER BY usage_date DESC;

-- Enable RLS on the view
ALTER VIEW public.daily_usage_summary SET (security_invoker = true);
