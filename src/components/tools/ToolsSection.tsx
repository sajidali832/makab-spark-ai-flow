
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
        { name: 'duration', label: 'Duration', type: 'select' as const, options: ['30 seconds', '1 minute', '2 minutes', '5 minutes'], placeholder: 'Select duration' },
        { name: 'style', label: 'Style', type: 'select' as const, options: ['Educational', 'Entertainment', 'Tutorial', 'Review'], placeholder: 'Select style' }
      ],
      'blog-generator': [
        { name: 'topic', label: 'Blog Topic', type: 'text' as const, placeholder: 'Enter your blog topic...' },
        { name: 'length', label: 'Length', type: 'select' as const, options: ['Short (300 words)', 'Medium (600 words)', 'Long (1000+ words)'], placeholder: 'Select length' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who is your target audience?' }
      ],
      'reel-ideas': [
        { name: 'niche', label: 'Your Niche', type: 'text' as const, placeholder: 'e.g., fitness, cooking, travel...' },
        { name: 'mood', label: 'Mood/Tone', type: 'select' as const, options: ['Fun', 'Educational', 'Inspiring', 'Trending'], placeholder: 'Select mood' }
      ],
      'engagement-questions': [
        { name: 'topic', label: 'Story Topic', type: 'text' as const, placeholder: 'What is your story about?' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who are you targeting?' }
      ],
      'caption': [
        { name: 'topic', label: 'Post Topic', type: 'text' as const, placeholder: 'What is your post about?' },
        { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Professional', 'Casual', 'Funny', 'Inspiring'], placeholder: 'Select tone' },
        { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter'], placeholder: 'Select platform' }
      ],
      'hashtag': [
        { name: 'topic', label: 'Content Topic', type: 'text' as const, placeholder: 'What is your content about?' },
        { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'TikTok', 'Twitter', 'LinkedIn'], placeholder: 'Select platform' }
      ],
      'idea': [
        { name: 'niche', label: 'Your Niche/Industry', type: 'text' as const, placeholder: 'e.g., fitness, technology, food...' },
        { name: 'contentType', label: 'Content Type', type: 'select' as const, options: ['Video', 'Blog Post', 'Social Media', 'Email'], placeholder: 'Select content type' }
      ],
      'youtube': [
        { name: 'niche', label: 'Channel Niche', type: 'text' as const, placeholder: 'What is your channel about?' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'Who is your target audience?' }
      ],
      'bio': [
        { name: 'profession', label: 'Profession/Role', type: 'text' as const, placeholder: 'e.g., Software Developer, Artist...' },
        { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'Twitter', 'LinkedIn', 'TikTok'], placeholder: 'Select platform' },
        { name: 'personality', label: 'Personality', type: 'select' as const, options: ['Professional', 'Creative', 'Funny', 'Inspirational'], placeholder: 'Select style' }
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
