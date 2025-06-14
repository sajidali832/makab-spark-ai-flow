
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ToolForm from './ToolForm';

const ToolsSection = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const navigate = useNavigate();

  const tools = [
    {
      id: 'caption',
      name: 'Caption Generator',
      description: 'Generate engaging captions for your social media posts',
      icon: '📝',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'hashtag',
      name: 'Hashtag Generator',
      description: 'Create relevant hashtags to boost your post visibility',
      icon: '#️⃣',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'thread-generator',
      name: 'Thread Generator',
      description: 'Create engaging Twitter/X threads that tell a story',
      icon: '🧵',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'story-ideas',
      name: 'Story Ideas',
      description: 'Get creative ideas for your Instagram and Facebook stories',
      icon: '💡',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'bio-generator',
      name: 'Bio Generator',
      description: 'Create compelling bios for your social media profiles',
      icon: '👤',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'ad-copy',
      name: 'Ad Copy Generator',
      description: 'Generate persuasive ad copy for your marketing campaigns',
      icon: '🎯',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const quickAccessItems = [
    {
      id: 'templates',
      name: 'Quick Templates',
      description: 'Ready-to-use content templates for instant generation',
      icon: <Zap className="h-6 w-6" />,
      color: 'from-blue-100 to-cyan-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      onClick: () => navigate('/templates')
    },
    {
      id: 'favorites',
      name: 'My Favorites',
      description: 'Access your saved and favorite generated content',
      icon: <Heart className="h-6 w-6 fill-current" />,
      color: 'from-pink-100 to-red-100',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-800',
      onClick: () => navigate('/favorites')
    }
  ];

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedTool(null)}
              className="mb-4 bg-white/80 hover:bg-white"
            >
              ← Back to Tools
            </Button>
          </div>
          <ToolForm toolId={selectedTool} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Content Creation Tools
          </h1>
          <p className="text-gray-600 text-lg">
            Choose a tool to start creating amazing content for your social media
          </p>
        </div>

        {/* Quick Access Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickAccessItems.map((item) => (
              <Card 
                key={item.id} 
                className={`bg-gradient-to-r ${item.color} ${item.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group`}
                onClick={item.onClick}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`${item.textColor} opacity-80 group-hover:opacity-100 transition-opacity`}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${item.textColor} mb-1`}>{item.name}</h3>
                        <p className={`text-sm ${item.textColor} opacity-80`}>{item.description}</p>
                      </div>
                    </div>
                    <ArrowRight className={`h-5 w-5 ${item.textColor} opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Content Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card 
                key={tool.id} 
                className="bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedTool(tool.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                      {tool.icon}
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardTitle className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                    {tool.name}
                  </CardTitle>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsSection;
