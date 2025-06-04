
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

const toolConfigurations = {
  caption: {
    fields: [
      { name: 'topic', label: 'Topic', type: 'text', required: true, placeholder: 'e.g., New product launch, Travel experience' },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Young professionals, Travel enthusiasts' },
      { name: 'tone', label: 'Tone', type: 'select', required: true, options: ['Friendly', 'Professional', 'Humorous', 'Exciting', 'Inspirational', 'Casual'] },
      { name: 'emotion', label: 'Emotion', type: 'select', required: true, options: ['Happy', 'Excited', 'Grateful', 'Surprised', 'Motivated', 'Thoughtful'] },
      { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok'] },
      { name: 'hashtags', label: 'Include Hashtags', type: 'select', required: true, options: ['Yes', 'No'] }
    ]
  },
  script: {
    fields: [
      { name: 'topic', label: 'Video Topic', type: 'text', required: true, placeholder: 'e.g., How to cook pasta, Tech review' },
      { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['YouTube', 'TikTok', 'Instagram Reels', 'YouTube Shorts'] },
      { name: 'tone', label: 'Tone', type: 'select', required: true, options: ['Informative', 'Entertaining', 'Educational', 'Conversational', 'Professional'] },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Beginners, Tech enthusiasts, Students' },
      { name: 'length', label: 'Video Length', type: 'select', required: true, options: ['15-30 seconds', '30-60 seconds', '1-3 minutes', '3-5 minutes', '5-10 minutes'] },
      { name: 'style', label: 'Video Style', type: 'select', required: true, options: ['Tutorial', 'Review', 'Story-telling', 'Q&A', 'Behind-the-scenes'] },
      { name: 'hook', label: 'Hook Style', type: 'select', required: true, options: ['Question', 'Statement', 'Statistic', 'Story', 'Problem'] }
    ]
  },
  hashtag: {
    fields: [
      { name: 'niche', label: 'Content Niche', type: 'text', required: true, placeholder: 'e.g., Fitness, Food, Travel, Tech' },
      { name: 'keywords', label: 'Main Keywords', type: 'text', required: true, placeholder: 'e.g., workout, healthy eating, motivation' },
      { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['Instagram', 'Twitter', 'TikTok', 'LinkedIn', 'YouTube'] },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Fitness enthusiasts, Young adults' },
      { name: 'size', label: 'Hashtag Mix', type: 'select', required: true, options: ['Popular hashtags', 'Niche hashtags', 'Mixed (popular + niche)', 'Long-tail hashtags'] },
      { name: 'count', label: 'Number of Hashtags', type: 'select', required: true, options: ['10 hashtags', '20 hashtags', '30 hashtags'] }
    ]
  },
  idea: {
    fields: [
      { name: 'industry', label: 'Industry/Niche', type: 'text', required: true, placeholder: 'e.g., E-commerce, SaaS, Education' },
      { name: 'goal', label: 'Main Goal', type: 'text', required: true, placeholder: 'e.g., Increase engagement, Drive sales, Build awareness' },
      { name: 'type', label: 'Content Type', type: 'select', required: true, options: ['Social Media Posts', 'Blog Topics', 'Video Ideas', 'Marketing Campaigns', 'Product Features'] },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Small business owners, Students, Parents' },
      { name: 'timeframe', label: 'Content Timeline', type: 'select', required: true, options: ['Weekly content', 'Monthly content', 'Seasonal content', 'One-time campaign'] }
    ]
  },
  youtube: {
    fields: [
      { name: 'category', label: 'Content Category', type: 'text', required: true, placeholder: 'e.g., Tech, Lifestyle, Education, Gaming' },
      { name: 'skill', label: 'Your Skill Level', type: 'select', required: true, options: ['Complete Beginner', 'Some Experience', 'Intermediate', 'Advanced', 'Expert'] },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Young adults, Professionals, Students' },
      { name: 'content', label: 'Content Format', type: 'select', required: true, options: ['Tutorials', 'Reviews', 'Vlogs', 'Entertainment', 'Educational', 'News/Commentary'] },
      { name: 'equipment', label: 'Available Equipment', type: 'select', required: true, options: ['Smartphone only', 'Basic camera setup', 'Professional equipment', 'No specific equipment'] },
      { name: 'frequency', label: 'Upload Frequency', type: 'select', required: true, options: ['Daily', 'Few times a week', 'Weekly', 'Bi-weekly', 'Monthly'] }
    ]
  },
  bio: {
    fields: [
      { name: 'profession', label: 'Profession/Role', type: 'text', required: true, placeholder: 'e.g., Digital Marketer, Student, Entrepreneur' },
      { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Facebook'] },
      { name: 'vibe', label: 'Personality Style', type: 'select', required: true, options: ['Professional', 'Creative', 'Minimalist', 'Fun & Quirky', 'Inspirational', 'Mysterious'] },
      { name: 'hobbies', label: 'Interests/Hobbies', type: 'text', required: false, placeholder: 'e.g., Photography, Travel, Fitness (optional)' },
      { name: 'achievement', label: 'Key Achievement', type: 'text', required: false, placeholder: 'e.g., 10k followers, Published author (optional)' },
      { name: 'cta', label: 'Call to Action', type: 'text', required: false, placeholder: 'e.g., DM for collaborations, Check my website (optional)' }
    ]
  },
  blog: {
    fields: [
      { name: 'topic', label: 'Blog Topic', type: 'text', required: true, placeholder: 'e.g., Best productivity apps, Beginner guide to investing' },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Busy professionals, College students' },
      { name: 'tone', label: 'Writing Tone', type: 'select', required: true, options: ['Professional', 'Casual', 'Educational', 'Conversational', 'Authoritative', 'Friendly'] },
      { name: 'length', label: 'Post Length', type: 'select', required: true, options: ['Short (500-800 words)', 'Medium (800-1200 words)', 'Long (1200-2000 words)', 'In-depth (2000+ words)'] },
      { name: 'keywords', label: 'SEO Keywords', type: 'text', required: false, placeholder: 'e.g., productivity, time management, apps (optional)' },
      { name: 'structure', label: 'Content Structure', type: 'select', required: true, options: ['Listicle', 'How-to Guide', 'Case Study', 'Opinion Piece', 'Comparison', 'Tutorial'] }
    ]
  },
  reel: {
    fields: [
      { name: 'niche', label: 'Content Niche', type: 'text', required: true, placeholder: 'e.g., Fitness, Cooking, Business tips' },
      { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['Instagram Reels', 'TikTok', 'YouTube Shorts', 'Facebook Reels'] },
      { name: 'style', label: 'Content Style', type: 'select', required: true, options: ['Educational', 'Entertainment', 'Trending Dance', 'Behind-the-scenes', 'Before/After', 'Day in the life'] },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Fitness beginners, Young professionals' },
      { name: 'duration', label: 'Video Duration', type: 'select', required: true, options: ['15-30 seconds', '30-60 seconds', '60-90 seconds'] },
      { name: 'trend', label: 'Trend Type', type: 'select', required: true, options: ['Current trending audio', 'Educational trend', 'Challenge trend', 'Original content'] }
    ]
  },
  engagement: {
    fields: [
      { name: 'topic', label: 'Post Topic', type: 'text', required: true, placeholder: 'e.g., Weekend plans, Favorite books, Career advice' },
      { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['Instagram Stories', 'Instagram Posts', 'Facebook', 'LinkedIn', 'Twitter Polls'] },
      { name: 'type', label: 'Question Type', type: 'select', required: true, options: ['This or That', 'Opinion Questions', 'Yes/No Questions', 'Fill in the blank', 'Rate from 1-10', 'Multiple Choice'] },
      { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'e.g., Young professionals, Students, Parents' },
      { name: 'goal', label: 'Engagement Goal', type: 'select', required: true, options: ['Get to know audience', 'Drive comments', 'Start conversation', 'Gather feedback', 'Entertainment'] }
    ]
  }
};

const ToolsSection = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools: Tool[] = [
    { 
      id: 'caption', 
      name: 'Caption Generator', 
      icon: MessageSquare, 
      available: true, 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Create engaging social media captions'
    },
    { 
      id: 'script', 
      name: 'Script Generator', 
      icon: FileText, 
      available: true, 
      gradient: 'from-purple-500 to-pink-500',
      description: 'Write compelling video scripts'
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
      id: 'blog', 
      name: 'Blog Post Generator', 
      icon: BookOpen, 
      available: true, 
      gradient: 'from-teal-500 to-blue-500',
      description: 'Create engaging blog content'
    },
    { 
      id: 'reel', 
      name: 'Reel Idea Generator', 
      icon: Video, 
      available: true, 
      gradient: 'from-pink-500 to-violet-500',
      description: 'Generate viral reel concepts'
    },
    { 
      id: 'engagement', 
      name: 'Engagement Question Generator', 
      icon: HelpCircle, 
      available: true, 
      gradient: 'from-orange-500 to-red-500',
      description: 'Create interactive story questions'
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

  if (selectedTool) {
    const tool = tools.find(t => t.id === selectedTool);
    if (tool) {
      const toolConfig = toolConfigurations[tool.id as keyof typeof toolConfigurations];
      return (
        <ToolForm 
          tool={{
            id: tool.id,
            name: tool.name,
            description: tool.description,
            icon: tool.icon,
            color: `bg-gradient-to-r ${tool.gradient}`,
            fields: toolConfig.fields
          }}
          onBack={() => setSelectedTool(null)} 
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Content Tools
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Transform your ideas into engaging content with our AI-powered tools
          </p>
          <div className="flex items-center justify-center space-x-1 text-blue-500">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold text-gray-700">High Quality</span>
            <Star className="h-4 w-4 fill-current" />
          </div>
        </div>
        
        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-6 rounded-2xl"
                    onClick={() => tool.available && setSelectedTool(tool.id)}
                    disabled={!tool.available}
                  >
                    <div className="flex flex-col items-center space-y-4 w-full">
                      <div className="relative">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br ${tool.gradient} text-white shadow-2xl group-hover:shadow-3xl transition-all duration-500 ${!tool.available ? 'grayscale' : ''}`}>
                          <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
                        </div>
                        {tool.available && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <Zap className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center space-y-2">
                        <p className={`font-bold text-base sm:text-lg ${tool.available ? 'text-gray-800' : 'text-gray-400'}`}>
                          {tool.name}
                        </p>
                        <p className={`text-xs sm:text-sm ${tool.available ? 'text-gray-600' : 'text-gray-400'}`}>
                          {tool.description}
                        </p>
                        {!tool.available && (
                          <div className="bg-gray-100 rounded-full px-3 py-1 mt-2">
                            <p className="text-xs text-gray-500 font-medium">Coming Soon</p>
                          </div>
                        )}
                      </div>
                      
                      {tool.available && (
                        <div className="flex items-center space-x-2 text-purple-600 group-hover:text-purple-700 transition-colors">
                          <span className="text-sm font-medium">Try Now</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </div>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Features Badge */}
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 shadow-lg">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-bold text-gray-800">All Tools Available</span>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 inline-block shadow-lg">
            Made with ❤️ by Sajid
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolsSection;
