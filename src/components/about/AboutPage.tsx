
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <img src="/lovable-uploads/0a6f6566-e098-48bb-8fbe-fcead42f3a46.png" alt="Makab" className="w-20 h-20 rounded-2xl" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MAKAB
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Your intelligent AI companion for conversations and content creation. 
            Experience the future of AI assistance.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Powered
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 text-sm">
              <Zap className="h-4 w-4 mr-2" />
              Lightning Fast
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <CardHeader className={`bg-gradient-to-r ${feature.color} text-white`}>
                <CardTitle className="flex items-center space-x-3">
                  <feature.icon className="h-6 w-6" />
                  <span>{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Creator */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Made with ❤️ by Sajid</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Crafted with passion and dedication to bring you the best AI experience. 
              Constantly evolving to meet your needs and exceed your expectations.
            </p>
            
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span className="text-sm">Built with React</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">User Focused</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm">AI Enhanced</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Limits Info */}
        <Card className="mt-8 border-0 shadow-lg bg-amber-50/80 backdrop-blur-sm border border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Daily Usage Limits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-amber-700">Chat Messages</span>
              <Badge className="bg-amber-200 text-amber-800">6 per day</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-700">Tool Generations</span>
              <Badge className="bg-amber-200 text-amber-800">3 per day</Badge>
            </div>
            <p className="text-sm text-amber-600 mt-3">
              Limits reset daily at midnight (12:00 AM) to ensure fair usage for everyone! ⭐
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
