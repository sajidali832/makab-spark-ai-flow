
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
  Zap
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
      id: 'instagram', 
      name: 'Instagram Post Generator', 
      icon: Instagram, 
      available: false, 
      gradient: 'from-gray-400 to-gray-500',
      description: 'Coming soon - Instagram content'
    },
    { 
      id: 'bio', 
      name: 'Bio Generator', 
      icon: User, 
      available: true, 
      gradient: 'from-indigo-500 to-purple-500',
      description: 'Craft perfect profile bios'
    },
  ];

  if (selectedTool) {
    return (
      <ToolForm 
        toolId={selectedTool} 
        onBack={() => setSelectedTool(null)} 
      />
    );
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
