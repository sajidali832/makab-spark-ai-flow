
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
  HelpCircle
} from 'lucide-react';
import ToolForm from './ToolForm';

interface Tool {
  id: string;
  name: string;
  icon: any;
  available: boolean;
  gradient: string;
  description: string;
}

const ToolsSection = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools: Tool[] = [
    { 
      id: 'script-generator', 
      name: 'Script Generator', 
      icon: FileText, 
      available: true, 
      gradient: 'from-purple-500 to-pink-500',
      description: 'Write compelling video scripts'
    },
    { 
      id: 'blog-generator', 
      name: 'Blog Post Generator', 
      icon: BookOpen, 
      available: true, 
      gradient: 'from-teal-500 to-blue-500',
      description: 'Create engaging blog content'
    },
    { 
      id: 'reel-ideas', 
      name: 'Reel Idea Generator', 
      icon: Video, 
      available: true, 
      gradient: 'from-pink-500 to-violet-500',
      description: 'Generate viral reel concepts'
    },
    { 
      id: 'engagement-questions', 
      name: 'Engagement Question Generator', 
      icon: HelpCircle, 
      available: true, 
      gradient: 'from-orange-500 to-red-500',
      description: 'Create interactive story questions'
    },
    { 
      id: 'caption', 
      name: 'Caption Generator', 
      icon: MessageSquare, 
      available: true, 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Create engaging social media captions'
    },
    { 
      id: 'hashtag', 
      name: 'Hashtag Generator', 
      icon: Hash, 
      available: true, 
      gradient: 'from-green-500 to-emerald-500',
      description: 'Generate trending hashtags'
    },
    { 
      id: 'idea', 
      name: 'Idea Generator', 
      icon: Lightbulb, 
      available: true, 
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Spark creative content ideas'
    },
    { 
      id: 'youtube', 
      name: 'YouTube Channel Ideas', 
      icon: Youtube, 
      available: true, 
      gradient: 'from-red-500 to-rose-500',
      description: 'Build your YouTube presence'
    },
    { 
      id: 'bio', 
      name: 'Bio Generator', 
      icon: User, 
      available: true, 
      gradient: 'from-indigo-500 to-purple-500',
      description: 'Craft perfect profile bios'
    },
    { 
      id: 'instagram', 
      name: 'Instagram Post Generator', 
      icon: Instagram, 
      available: false, 
      gradient: 'from-gray-400 to-gray-500',
      description: 'Coming soon - Instagram content'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 py-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Content Tools
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into engaging content with our powerful AI-powered tools
            </p>
            <div className="flex items-center justify-center space-x-3 text-blue-600">
              <Star className="h-5 w-5 fill-current" />
              <span className="text-sm font-semibold text-gray-700">Premium Quality</span>
              <Zap className="h-5 w-5 fill-current text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">Lightning Fast</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        {/* Enhanced Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-xl overflow-hidden bg-white/90 backdrop-blur-sm">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-6 rounded-2xl flex flex-col space-y-4"
                    onClick={() => tool.available && setSelectedTool(tool.id)}
                    disabled={!tool.available}
                  >
                    <div className="relative">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br ${tool.gradient} text-white shadow-2xl group-hover:shadow-3xl transition-all duration-500 ${!tool.available ? 'grayscale' : ''}`}>
                        <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
                      </div>
                      {tool.available && (
                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center space-y-3">
                      <h3 className={`font-bold text-lg ${tool.available ? 'text-gray-800' : 'text-gray-400'}`}>
                        {tool.name}
                      </h3>
                      <p className={`text-sm leading-relaxed ${tool.available ? 'text-gray-600' : 'text-gray-400'}`}>
                        {tool.description}
                      </p>
                      {!tool.available && (
                        <div className="bg-gray-100 rounded-full px-4 py-2 mt-3">
                          <p className="text-xs text-gray-500 font-medium">Coming Soon</p>
                        </div>
                      )}
                    </div>
                    
                    {tool.available && (
                      <div className="flex items-center space-x-2 text-purple-600 group-hover:text-purple-700 transition-colors pt-2">
                        <span className="text-sm font-medium">Try Now</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Enhanced Features Section */}
        <div className="text-center py-8 space-y-6">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-8 py-4 shadow-lg">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-800">All Tools Available Now</span>
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-blue-600">9+</div>
              <div className="text-sm text-gray-600">AI Tools</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-600">Possibilities</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-pink-600">100%</div>
              <div className="text-sm text-gray-600">AI Powered</div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 inline-block shadow-lg">
            Made with ❤️ by <span className="font-semibold text-purple-600">Sajid</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolsSection;
