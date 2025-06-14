import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  FileText, 
  Hash, 
  Lightbulb, 
  Youtube, 
  Instagram, 
  User,
  ArrowRight,
  Sparkles,
  Star,
  Zap,
  BookOpen,
  Video,
  HelpCircle,
  Mail,
  MessageCircle,
  Linkedin,
  Image,
  Search
} from 'lucide-react';
import ToolForm from './ToolForm';

interface Tool {
  id: string;
  name: string;
  icon: any;
  available: boolean;
  gradient: string;
  description: string;
  category: string;
}

const ToolsSection = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools: Tool[] = [
    { 
      id: 'script-generator', 
      name: 'Script Generator', 
      icon: FileText, 
      available: true, 
      gradient: 'from-purple-500 via-purple-600 to-pink-500',
      description: 'Create professional video scripts',
      category: 'Video'
    },
    { 
      id: 'blog-generator', 
      name: 'Blog Post Generator', 
      icon: BookOpen, 
      available: true, 
      gradient: 'from-teal-500 via-cyan-600 to-blue-500',
      description: 'Write compelling blog content',
      category: 'Writing'
    },
    { 
      id: 'reel-ideas', 
      name: 'Reel Ideas', 
      icon: Video, 
      available: true, 
      gradient: 'from-pink-500 via-rose-600 to-violet-500',
      description: 'Generate viral reel concepts',
      category: 'Video'
    },
    { 
      id: 'engagement-questions', 
      name: 'Story Questions', 
      icon: HelpCircle, 
      available: true, 
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      description: 'Create interactive questions',
      category: 'Engagement'
    },
    { 
      id: 'caption', 
      name: 'Caption Generator', 
      icon: MessageSquare, 
      available: true, 
      gradient: 'from-blue-500 via-indigo-600 to-cyan-500',
      description: 'Write engaging captions',
      category: 'Social'
    },
    { 
      id: 'hashtag', 
      name: 'Hashtag Generator', 
      icon: Hash, 
      available: true, 
      gradient: 'from-green-500 via-emerald-600 to-teal-500',
      description: 'Generate trending hashtags',
      category: 'Social'
    },
    { 
      id: 'idea', 
      name: 'Content Ideas', 
      icon: Lightbulb, 
      available: true, 
      gradient: 'from-yellow-500 via-amber-600 to-orange-500',
      description: 'Spark creative content ideas',
      category: 'Ideas'
    },
    { 
      id: 'youtube', 
      name: 'YouTube Ideas', 
      icon: Youtube, 
      available: true, 
      gradient: 'from-red-500 via-red-600 to-rose-500',
      description: 'Build your YouTube channel',
      category: 'Video'
    },
    { 
      id: 'bio', 
      name: 'Bio Generator', 
      icon: User, 
      available: true, 
      gradient: 'from-indigo-500 via-purple-600 to-blue-500',
      description: 'Craft perfect profile bios',
      category: 'Profile'
    },
    { 
      id: 'email-subject', 
      name: 'Email Subject Lines', 
      icon: Mail, 
      available: true, 
      gradient: 'from-emerald-500 via-teal-600 to-cyan-500',
      description: 'Create compelling email subjects',
      category: 'Marketing'
    },
    { 
      id: 'thread-generator', 
      name: 'Thread Generator', 
      icon: MessageCircle, 
      available: true, 
      gradient: 'from-violet-500 via-purple-600 to-indigo-500',
      description: 'Generate engaging thread content',
      category: 'Social'
    },
    { 
      id: 'linkedin-post', 
      name: 'LinkedIn Post', 
      icon: Linkedin, 
      available: true, 
      gradient: 'from-blue-600 via-blue-700 to-indigo-600',
      description: 'Professional LinkedIn content',
      category: 'Professional'
    },
    { 
      id: 'image-prompt', 
      name: 'Image Prompt', 
      icon: Image, 
      available: true, 
      gradient: 'from-pink-500 via-rose-600 to-red-500',
      description: 'AI image generation prompts',
      category: 'Creative'
    },
    { 
      id: 'seo-title', 
      name: 'SEO Title Generator', 
      icon: Search, 
      available: true, 
      gradient: 'from-green-600 via-emerald-700 to-teal-600',
      description: 'Optimize titles for search',
      category: 'SEO'
    },
    { 
      id: 'instagram', 
      name: 'Instagram Posts', 
      icon: Instagram, 
      available: false, 
      gradient: 'from-gray-400 to-gray-500',
      description: 'Coming soon - Instagram content',
      category: 'Social'
    },
  ];

  const getToolDefinition = (toolId: string) => {
    const baseInputs = {
      'script-generator': [
        { name: 'topic', label: 'Video Topic', type: 'text' as const, placeholder: 'Enter your video topic...' },
        { name: 'duration', label: 'Duration', type: 'select' as const, options: ['30 seconds', '1 minute', '2 minutes', '5 minutes', '10+ minutes'], placeholder: 'Select duration' },
        { name: 'platform', label: 'Platform', type: 'select' as const, options: ['YouTube', 'TikTok', 'Instagram Reels', 'Facebook', 'LinkedIn'], placeholder: 'Select platform' },
        { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Professional', 'Casual', 'Funny', 'Inspiring', 'Educational', 'Dramatic'], placeholder: 'Select tone' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who is your target audience?' },
        { name: 'style', label: 'Style', type: 'select' as const, options: ['Educational', 'Entertainment', 'Tutorial', 'Review', 'Storytelling', 'Documentary'], placeholder: 'Select style' },
        { name: 'keywords', label: 'Keywords (optional)', type: 'text' as const, placeholder: 'SEO keywords to include...' },
        { name: 'cta', label: 'Call-to-Action', type: 'select' as const, options: ['Subscribe', 'Like & Share', 'Visit Website', 'Download App', 'Custom'], placeholder: 'Select CTA' }
      ],
      'blog-generator': [
        { name: 'topic', label: 'Blog Topic', type: 'text' as const, placeholder: 'Enter your blog topic...' },
        { name: 'length', label: 'Length', type: 'select' as const, options: ['Short (300-500 words)', 'Medium (600-1000 words)', 'Long (1000-2000 words)', 'Very Long (2000+ words)'], placeholder: 'Select length' },
        { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Professional', 'Conversational', 'Academic', 'Friendly', 'Authoritative', 'Humorous'], placeholder: 'Select tone' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who is your target audience?' },
        { name: 'structure', label: 'Structure', type: 'select' as const, options: ['How-to Guide', 'Listicle', 'Opinion Piece', 'Case Study', 'News Article', 'Review'], placeholder: 'Select structure' },
        { name: 'keywords', label: 'SEO Keywords', type: 'text' as const, placeholder: 'Main keywords for SEO...' },
        { name: 'cta', label: 'Call-to-Action', type: 'text' as const, placeholder: 'What action should readers take?' }
      ],
      'reel-ideas': [
        { name: 'niche', label: 'Your Niche', type: 'text' as const, placeholder: 'e.g., fitness, cooking, travel...' },
        { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram Reels', 'TikTok', 'YouTube Shorts', 'Facebook Reels'], placeholder: 'Select platform' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who are you targeting?' },
        { name: 'trendType', label: 'Trend Type', type: 'select' as const, options: ['Dance', 'Comedy', 'Educational', 'Behind-the-scenes', 'Transformation', 'Challenge'], placeholder: 'Select trend type' },
        { name: 'goals', label: 'Content Goals', type: 'select' as const, options: ['Viral reach', 'Engagement', 'Education', 'Entertainment', 'Brand awareness', 'Sales'], placeholder: 'Select goal' },
        { name: 'style', label: 'Style', type: 'select' as const, options: ['Fun', 'Educational', 'Inspiring', 'Trending', 'Professional', 'Casual'], placeholder: 'Select style' },
        { name: 'duration', label: 'Duration', type: 'select' as const, options: ['15 seconds', '30 seconds', '60 seconds', '90 seconds'], placeholder: 'Select duration' }
      ],
      'engagement-questions': [
        { name: 'topic', label: 'Story Topic', type: 'text' as const, placeholder: 'What is your story about?' },
        { name: 'contentType', label: 'Content Type', type: 'select' as const, options: ['Instagram Stories', 'TikTok', 'YouTube Community', 'Facebook Stories', 'LinkedIn'], placeholder: 'Select content type' },
        { name: 'questionType', label: 'Question Type', type: 'select' as const, options: ['This or That', 'Yes/No', 'Multiple Choice', 'Open-ended', 'Rating Scale'], placeholder: 'Select question type' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who are you targeting?' },
        { name: 'engagementGoal', label: 'Engagement Goal', type: 'select' as const, options: ['Increase comments', 'Drive DMs', 'Build community', 'Get feedback', 'Start conversation'], placeholder: 'Select goal' },
        { name: 'quantity', label: 'Number of Questions', type: 'select' as const, options: ['5', '10', '15', '20'], placeholder: 'How many questions?' },
        { name: 'industry', label: 'Industry (optional)', type: 'text' as const, placeholder: 'Your industry/niche...' }
      ],
      'caption': [
        { name: 'topic', label: 'Post Topic', type: 'text' as const, placeholder: 'What is your post about?' },
        { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok'], placeholder: 'Select platform' },
        { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Professional', 'Casual', 'Funny', 'Inspiring', 'Educational', 'Promotional'], placeholder: 'Select tone' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who is your target audience?' },
        { name: 'length', label: 'Caption Length', type: 'select' as const, options: ['Short (1-2 sentences)', 'Medium (3-5 sentences)', 'Long (paragraph)', 'Very Long (story format)'], placeholder: 'Select length' },
        { name: 'cta', label: 'Call-to-Action', type: 'select' as const, options: ['Like & Share', 'Comment below', 'Visit link in bio', 'Tag a friend', 'Save this post', 'Custom'], placeholder: 'Select CTA' },
        { name: 'keywords', label: 'Keywords (optional)', type: 'text' as const, placeholder: 'Important keywords to include...' }
      ],
      'hashtag': [
        { name: 'topic', label: 'Content Topic', type: 'text' as const, placeholder: 'What is your content about?' },
        { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube'], placeholder: 'Select platform' },
        { name: 'niche', label: 'Niche/Industry', type: 'text' as const, placeholder: 'Your niche or industry...' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who are you targeting?' },
        { name: 'count', label: 'Number of Hashtags', type: 'select' as const, options: ['15', '20', '25', '30'], placeholder: 'How many hashtags?' },
        { name: 'mix', label: 'Hashtag Mix', type: 'select' as const, options: ['Trending focused', 'Niche focused', 'Balanced mix', 'Long-tail focused'], placeholder: 'Select mix type' }
      ],
      'idea': [
        { name: 'niche', label: 'Your Niche/Industry', type: 'text' as const, placeholder: 'e.g., fitness, technology, food...' },
        { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'LinkedIn', 'Twitter'], placeholder: 'Select platform' },
        { name: 'contentType', label: 'Content Type', type: 'select' as const, options: ['Video', 'Image Post', 'Story', 'Reel/Short', 'Blog Post', 'Carousel'], placeholder: 'Select content type' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who is your target audience?' },
        { name: 'goals', label: 'Content Goals', type: 'select' as const, options: ['Increase followers', 'Drive engagement', 'Generate leads', 'Build brand awareness', 'Educate audience', 'Drive sales'], placeholder: 'Select goals' },
        { name: 'quantity', label: 'Number of Ideas', type: 'select' as const, options: ['10', '15', '20', '25', '30'], placeholder: 'How many ideas?' }
      ],
      'youtube': [
        { name: 'niche', label: 'Channel Niche', type: 'text' as const, placeholder: 'What is your channel about?' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who is your target audience?' },
        { name: 'contentStyle', label: 'Content Style', type: 'select' as const, options: ['Educational', 'Entertainment', 'Vlogs', 'Reviews', 'Tutorials', 'Gaming', 'Lifestyle'], placeholder: 'Select content style' },
        { name: 'experience', label: 'Experience Level', type: 'select' as const, options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], placeholder: 'Your experience level' },
        { name: 'goals', label: 'Channel Goals', type: 'select' as const, options: ['Build audience', 'Generate income', 'Share knowledge', 'Build brand', 'Have fun'], placeholder: 'Select goals' },
        { name: 'frequency', label: 'Upload Frequency', type: 'select' as const, options: ['Daily', '3x per week', 'Weekly', 'Bi-weekly', 'Monthly'], placeholder: 'How often will you upload?' }
      ],
      'bio': [
        { name: 'profession', label: 'Profession/Role', type: 'text' as const, placeholder: 'e.g., Software Developer, Artist...' },
        { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Facebook'], placeholder: 'Select platform' },
        { name: 'personality', label: 'Personality', type: 'select' as const, options: ['Professional', 'Creative', 'Funny', 'Inspirational', 'Casual', 'Authoritative'], placeholder: 'Select style' },
        { name: 'achievements', label: 'Key Achievements', type: 'text' as const, placeholder: 'Your key achievements or credentials...' },
        { name: 'interests', label: 'Interests/Hobbies', type: 'text' as const, placeholder: 'Your interests or hobbies...' },
        { name: 'cta', label: 'Call-to-Action', type: 'select' as const, options: ['Visit website', 'DM for inquiries', 'Check link in bio', 'Email me', 'Follow for tips', 'Custom'], placeholder: 'Select CTA' },
        { name: 'emojiStyle', label: 'Emoji Style', type: 'select' as const, options: ['Minimal', 'Moderate', 'Heavy', 'None'], placeholder: 'Select emoji usage' }
      ],
      'email-subject': [
        { name: 'emailType', label: 'Email Type', type: 'select' as const, options: ['Newsletter', 'Promotional', 'Welcome', 'Follow-up', 'Event', 'Product Launch', 'Re-engagement'], placeholder: 'Select email type' },
        { name: 'topic', label: 'Email Topic/Content', type: 'text' as const, placeholder: 'What is your email about?' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who are you emailing?' },
        { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Professional', 'Friendly', 'Urgent', 'Casual', 'Exciting', 'Informative'], placeholder: 'Select tone' },
        { name: 'goal', label: 'Primary Goal', type: 'select' as const, options: ['Open Rate', 'Click Through', 'Drive Sales', 'Build Awareness', 'Inform', 'Engage'], placeholder: 'Select goal' },
        { name: 'keywords', label: 'Keywords (optional)', type: 'text' as const, placeholder: 'Important keywords to include...' },
        { name: 'quantity', label: 'Number of Subject Lines', type: 'select' as const, options: ['5', '10', '15', '20'], placeholder: 'How many options?' }
      ],
      'thread-generator': [
        { name: 'topic', label: 'Thread Topic', type: 'text' as const, placeholder: 'What is your thread about?' },
        { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Twitter/X', 'LinkedIn', 'Instagram Stories', 'Facebook'], placeholder: 'Select platform' },
        { name: 'threadLength', label: 'Thread Length', type: 'select' as const, options: ['Short (3-5 posts)', 'Medium (6-10 posts)', 'Long (11-15 posts)', 'Extended (16-20 posts)'], placeholder: 'Select length' },
        { name: 'purpose', label: 'Thread Purpose', type: 'select' as const, options: ['Educational', 'Storytelling', 'Tips & Advice', 'Opinion/Commentary', 'How-to Guide', 'Personal Experience'], placeholder: 'Select purpose' },
        { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Professional', 'Casual', 'Inspirational', 'Humorous', 'Authoritative', 'Personal'], placeholder: 'Select tone' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who is your audience?' },
        { name: 'cta', label: 'Call-to-Action', type: 'select' as const, options: ['Follow for more', 'Share this thread', 'Comment your thoughts', 'Visit link', 'Subscribe', 'Custom'], placeholder: 'Select CTA' }
      ],
      'linkedin-post': [
        { name: 'topic', label: 'Post Topic', type: 'text' as const, placeholder: 'What do you want to post about?' },
        { name: 'postType', label: 'Post Type', type: 'select' as const, options: ['Professional Update', 'Industry Insight', 'Personal Story', 'Tips & Advice', 'Achievement', 'Opinion Piece', 'Company News'], placeholder: 'Select post type' },
        { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Professional', 'Thought Leadership', 'Personal', 'Inspirational', 'Educational', 'Conversational'], placeholder: 'Select tone' },
        { name: 'length', label: 'Post Length', type: 'select' as const, options: ['Short (1-2 paragraphs)', 'Medium (3-4 paragraphs)', 'Long (5-6 paragraphs)'], placeholder: 'Select length' },
        { name: 'industry', label: 'Industry/Field', type: 'text' as const, placeholder: 'Your industry or field...' },
        { name: 'audience', label: 'Target Audience', type: 'select' as const, options: ['Professionals in my field', 'Job seekers', 'Entrepreneurs', 'Industry leaders', 'General business audience', 'Potential clients'], placeholder: 'Select audience' },
        { name: 'cta', label: 'Call-to-Action', type: 'select' as const, options: ['Comment your thoughts', 'Share this post', 'Connect with me', 'Visit my profile', 'DM for more info', 'Custom'], placeholder: 'Select CTA' }
      ],
      'image-prompt': [
        { name: 'subject', label: 'Main Subject', type: 'text' as const, placeholder: 'What should be the main focus of the image?' },
        { name: 'style', label: 'Art Style', type: 'select' as const, options: ['Photorealistic', 'Digital Art', 'Oil Painting', 'Watercolor', 'Cartoon/Anime', 'Sketch', 'Abstract', 'Vintage', 'Modern'], placeholder: 'Select art style' },
        { name: 'mood', label: 'Mood/Atmosphere', type: 'select' as const, options: ['Bright & Cheerful', 'Dark & Moody', 'Peaceful & Calm', 'Dynamic & Energetic', 'Mysterious', 'Romantic', 'Professional'], placeholder: 'Select mood' },
        { name: 'setting', label: 'Setting/Background', type: 'text' as const, placeholder: 'Describe the environment or background...' },
        { name: 'colors', label: 'Color Palette', type: 'select' as const, options: ['Vibrant & Colorful', 'Monochrome', 'Warm tones', 'Cool tones', 'Pastel', 'High contrast', 'Natural colors'], placeholder: 'Select color palette' },
        { name: 'perspective', label: 'Camera Angle', type: 'select' as const, options: ['Close-up', 'Wide shot', 'Bird\'s eye view', 'Low angle', 'Eye level', 'Portrait', 'Landscape'], placeholder: 'Select angle' },
        { name: 'details', label: 'Additional Details', type: 'textarea' as const, placeholder: 'Any specific details, objects, or elements to include...' }
      ],
      'seo-title': [
        { name: 'topic', label: 'Content Topic', type: 'text' as const, placeholder: 'What is your content about?' },
        { name: 'contentType', label: 'Content Type', type: 'select' as const, options: ['Blog Post', 'Product Page', 'Service Page', 'Homepage', 'Category Page', 'Video', 'Guide/Tutorial'], placeholder: 'Select content type' },
        { name: 'keywords', label: 'Primary Keywords', type: 'text' as const, placeholder: 'Main keywords you want to rank for...' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who is searching for this content?' },
        { name: 'intent', label: 'Search Intent', type: 'select' as const, options: ['Informational', 'Commercial', 'Navigational', 'Transactional'], placeholder: 'Select search intent' },
        { name: 'titleStyle', label: 'Title Style', type: 'select' as const, options: ['How-to', 'List/Number', 'Question', 'Problem/Solution', 'Comparison', 'Guide', 'Review'], placeholder: 'Select style' },
        { name: 'quantity', label: 'Number of Titles', type: 'select' as const, options: ['5', '10', '15', '20'], placeholder: 'How many titles?' }
      ]
    };

    const toolData = tools.find(t => t.id === toolId);
    if (!toolData) return null;

    return {
      id: toolId,
      title: toolData.name,
      description: toolData.description,
      inputs: baseInputs[toolId as keyof typeof baseInputs] || []
    };
  };

  if (selectedTool) {
    const toolDefinition = getToolDefinition(selectedTool);
    if (!toolDefinition) {
      setSelectedTool(null);
      return null;
    }

    return (
      <ToolForm 
        tool={toolDefinition}
      />
    );
  }

  const categoryColors = {
    Video: 'from-red-100 to-pink-100',
    Writing: 'from-blue-100 to-cyan-100',
    Social: 'from-green-100 to-emerald-100',
    Engagement: 'from-orange-100 to-yellow-100',
    Ideas: 'from-purple-100 to-indigo-100',
    Profile: 'from-violet-100 to-purple-100',
    Marketing: 'from-emerald-100 to-teal-100',
    Professional: 'from-blue-100 to-indigo-100',
    Creative: 'from-pink-100 to-rose-100',
    SEO: 'from-green-100 to-emerald-100'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="text-center space-y-4 py-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Content Tools
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into engaging content with our powerful AI-powered tools
            </p>
            <div className="flex items-center justify-center space-x-3 text-blue-600">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Premium Quality</span>
              <Zap className="h-4 w-4 fill-current text-yellow-500" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Lightning Fast</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        {/* Enhanced Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.id} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden bg-white/95 backdrop-blur-sm">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-4 sm:p-6 rounded-2xl flex flex-col space-y-3 sm:space-y-4"
                    onClick={() => tool.available && setSelectedTool(tool.id)}
                    disabled={!tool.available}
                  >
                    <div className="relative">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-2xl sm:rounded-3xl flex items-center justify-center bg-gradient-to-br ${tool.gradient} text-white shadow-xl group-hover:shadow-2xl transition-all duration-300 ${!tool.available ? 'grayscale' : ''}`}>
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                      </div>
                      {tool.available && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                        </div>
                      )}
                      {!tool.available && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">•••</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[tool.category as keyof typeof categoryColors] || 'from-gray-100 to-gray-200'} text-gray-700`}>
                        {tool.category}
                      </div>
                      <h3 className={`font-bold text-base sm:text-lg ${tool.available ? 'text-gray-800' : 'text-gray-400'}`}>
                        {tool.name}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed ${tool.available ? 'text-gray-600' : 'text-gray-400'}`}>
                        {tool.description}
                      </p>
                      {!tool.available && (
                        <div className="bg-gray-100 rounded-full px-3 py-1 mt-2">
                          <p className="text-xs text-gray-500 font-medium">Coming Soon</p>
                        </div>
                      )}
                    </div>
                    
                    {tool.available && (
                      <div className="flex items-center justify-center space-x-2 text-purple-600 group-hover:text-purple-700 transition-colors pt-1">
                        <span className="text-xs sm:text-sm font-medium">Try Now</span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Enhanced Features Section */}
        <div className="text-center py-6 space-y-4">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="text-sm sm:text-base font-bold text-gray-800">14+ Tools Available Now</span>
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mt-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">14+</div>
              <div className="text-xs sm:text-sm text-gray-600">AI Tools</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">∞</div>
              <div className="text-xs sm:text-sm text-gray-600">Possibilities</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <div className="text-xl sm:text-2xl font-bold text-pink-600">100%</div>
              <div className="text-xs sm:text-sm text-gray-600">AI Powered</div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center py-4">
          <p className="text-xs sm:text-sm text-gray-500 bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 inline-block shadow-lg">
            Made with ❤️ by <span className="font-semibold text-purple-600">Sajid</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolsSection;
