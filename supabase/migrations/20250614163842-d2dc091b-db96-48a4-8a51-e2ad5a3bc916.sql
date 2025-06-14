
-- Create favorites table to store user's favorite generated content
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  content_preview TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create templates table for quick content generation
CREATE TABLE public.content_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tool_type TEXT NOT NULL,
  template_data JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" 
  ON public.favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
  ON public.favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON public.favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for templates (public read, admin write)
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active templates" 
  ON public.content_templates 
  FOR SELECT 
  USING (is_active = true);

-- Insert some default templates
INSERT INTO public.content_templates (name, description, category, tool_type, template_data) VALUES
('Daily Motivation Post', 'Inspirational content for daily engagement', 'Daily Posts', 'caption', '{"platform": "Instagram", "tone": "inspiring", "audience": "general", "length": "medium", "topic": "motivation and success"}'),
('Product Launch Announcement', 'Exciting launch post template', 'Promotions', 'caption', '{"platform": "Instagram", "tone": "exciting", "audience": "customers", "length": "medium", "topic": "new product launch"}'),
('Thank You Post', 'Grateful engagement with followers', 'Engagement', 'caption', '{"platform": "Instagram", "tone": "grateful", "audience": "followers", "length": "short", "topic": "thanking community"}'),
('Weekend Vibes', 'Casual weekend content', 'Daily Posts', 'caption', '{"platform": "Instagram", "tone": "casual", "audience": "general", "length": "short", "topic": "weekend relaxation"}'),
('Quick Tips Thread', 'Educational thread template', 'Educational', 'thread-generator', '{"platform": "Twitter", "threadLength": "5-7 tweets", "purpose": "educate", "tone": "helpful", "audience": "professionals", "topic": "productivity tips"}'),
('Flash Sale Promotion', 'Urgent promotional content', 'Promotions', 'caption', '{"platform": "Instagram", "tone": "urgent", "audience": "customers", "length": "medium", "topic": "limited time offer"}');
