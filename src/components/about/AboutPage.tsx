
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Users, Zap, Heart, Code, MessageSquare, Wrench } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description: "Intelligent conversations with advanced AI technology",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Wrench,
      title: "Content Creation Tools", 
      description: "Generate captions, scripts, hashtags and more",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Brain,
      title: "Smart Intelligence",
      description: "Powered by advanced language models",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Quick responses and instant generation",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  const stats = [
    { label: "Daily Chat Messages", value: "6", icon: MessageSquare },
    { label: "Tool Generations", value: "3", icon: Wrench },
    { label: "AI Models", value: "2+", icon: Brain },
    { label: "Features", value: "7", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl">
              <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MAKAB
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-3 sm:mb-4 max-w-2xl mx-auto px-2">
            Your intelligent AI companion for conversations and content creation. 
            Experience the future of AI assistance.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              AI Powered
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Lightning Fast
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-800 mb-0.5">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardHeader className={`bg-gradient-to-r ${feature.color} text-white p-3 sm:p-4`}>
                <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                  <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Creator */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Made with ❤️ by Sajid</h2>
            <p className="text-blue-100 mb-3 sm:mb-4 max-w-2xl mx-auto text-xs sm:text-sm px-2">
              Crafted with passion and dedication to bring you the best AI experience. 
              Constantly evolving to meet your needs and exceed your expectations.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <div className="flex items-center space-x-1">
                <Code className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Built with React</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">User Focused</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">AI Enhanced</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Limits Info */}
        <Card className="border-0 shadow-lg bg-amber-50/80 backdrop-blur-sm border border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 flex items-center space-x-2 text-sm sm:text-base">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Daily Usage Limits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="flex justify-between items-center">
              <span className="text-amber-700 text-xs sm:text-sm">Chat Messages</span>
              <Badge className="bg-amber-200 text-amber-800 text-xs">6 per day</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-700 text-xs sm:text-sm">Tool Generations</span>
              <Badge className="bg-amber-200 text-amber-800 text-xs">3 per day</Badge>
            </div>
            <p className="text-xs text-amber-600 mt-2">
              Limits reset daily at midnight (12:00 AM) to ensure fair usage for everyone! ⭐
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
