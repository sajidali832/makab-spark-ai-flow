
-- Create push subscriptions table to store user notification preferences and subscription data
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification logs table to track sent notifications
CREATE TABLE public.notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  icon_url TEXT,
  notification_type TEXT NOT NULL DEFAULT 'daily',
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMP WITH TIME ZONE
);

-- Create notification templates table for dynamic messages
CREATE TABLE public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  time_slot TEXT NOT NULL, -- 'morning' or 'evening'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for push_subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own push subscriptions" 
  ON public.push_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own push subscriptions" 
  ON public.push_subscriptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own push subscriptions" 
  ON public.push_subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own push subscriptions" 
  ON public.push_subscriptions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for notification_logs
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification logs" 
  ON public.notification_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notification logs" 
  ON public.notification_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification logs" 
  ON public.notification_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for notification_templates (public read for active templates)
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active notification templates" 
  ON public.notification_templates 
  FOR SELECT 
  USING (is_active = true);

-- Insert default notification templates
INSERT INTO public.notification_templates (title, body, notification_type, time_slot) VALUES
('🚀 Ready to create with Makab AI?', 'Your daily dose of creativity awaits! Generate amazing content for free.', 'daily', 'morning'),
('✨ New AI tools waiting for you!', 'Generate content that stands out today - completely free with Makab AI.', 'daily', 'morning'),
('💡 Beat writer''s block with Makab!', 'Let AI spark your creativity. Free tools, unlimited possibilities.', 'daily', 'morning'),
('🎯 Your AI assistant is here!', 'Create, innovate, and inspire with Makab - your free AI companion.', 'daily', 'morning'),
('🌟 Evening inspiration from Makab!', 'End your day with creative possibilities. Free AI tools at your fingertips.', 'daily', 'evening'),
('📝 Ready for tomorrow''s content?', 'Plan ahead with Makab AI. Generate fresh ideas tonight, for free!', 'daily', 'evening'),
('🔥 Don''t miss out on free AI magic!', 'Your evening dose of creativity awaits with Makab AI tools.', 'daily', 'evening'),
('💫 Makab AI says goodnight!', 'Tomorrow''s content success starts with tonight''s inspiration. It''s free!', 'daily', 'evening');
