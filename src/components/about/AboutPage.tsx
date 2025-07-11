
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Sparkles,
  Users,
  Zap,
  Heart,
  Code,
  MessageSquare,
  Wrench,
  Pencil,
  Info,
  ListTodo,
  Quote,
  Text,
  Image,
  Hash,
  BookOpenText,
  Video,
  Instagram,
  Clapperboard,
  FileText,
  Landmark,
  Globe,
  UserCheck,
  Share
} from 'lucide-react';

const TOOLS_LIST = [
  { icon: Pencil, name: "Caption Generator", desc: "Create catchy captions for any occasion." },
  { icon: Hash, name: "Hashtag Finder", desc: "Find trending and relevant hashtags." },
  { icon: Quote, name: "Quote Creator", desc: "Generate unique quotes and sayings." },
  { icon: Video, name: "Video Script", desc: "Get ready-to-use video scripts." },
  { icon: Instagram, name: "Instagram Bio", desc: "Perfect Insta bios for your profile." },
  { icon: Clapperboard, name: "Reel Idea", desc: "Fresh ideas for Reels and Shorts." },
  { icon: Image, name: "Image Post Caption", desc: "Captions crafted for image posts." },
  { icon: BookOpenText, name: "Blog Outline", desc: "Outline or structure blog posts fast." },
  { icon: FileText, name: "Ad Copy", desc: "Generate persuasive ad copy." },
  { icon: ListTodo, name: "Listicle", desc: "Create fun, list-based content in seconds." },
  { icon: Landmark, name: "YouTube Title", desc: "Catchy YouTube video titles." },
  { icon: Info, name: "Product Description", desc: "Detailed, converting product descriptions." },
  { icon: Text, name: "SEO Keyword", desc: "Relevant keywords for higher ranking." },
  { icon: Globe, name: "Web Page Intro", desc: "Intro paragraphs for websites/landing pages." }
];

const AboutPage = () => {
  const stats = [
    { label: "Daily Chat Messages", value: "10", icon: MessageSquare },
    { label: "Tool Generations", value: "6", icon: Wrench },
    { label: "AI Models", value: "2+", icon: Brain },
    { label: "Features", value: "14", icon: Sparkles }
  ];

  const handleShare = (platform: string) => {
    const url = window.location.origin;
    const text = "Check out MAKAB - Your intelligent AI companion for conversations and content creation!";
    
    let shareUrl = '';
    
    if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-2 sm:px-4 py-3 sm:py-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-4 sm:mb-6 animate-fade-in">
          <div className="flex justify-center mb-2 sm:mb-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl animate-scale-in">
              <img 
                src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" 
                alt="Makab" 
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl" 
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MAKAB
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-2 sm:mb-3 px-2 sm:px-4 leading-relaxed">
            Your intelligent AI companion for conversations and content creation.
            Experience the future of AI assistance.
          </p>
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 sm:px-3 py-1 text-xs animate-fade-in">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              AI Powered
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 sm:px-3 py-1 text-xs animate-fade-in">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Lightning Fast
            </Badge>
          </div>
        </div>

        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6 animate-fade-in">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-md bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-2 sm:p-3 md:p-4">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md sm:rounded-lg flex items-center justify-center">
                    <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                  </div>
                </div>
                <div className="text-sm sm:text-lg md:text-xl font-bold text-gray-800 mb-0.5">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tools Section - Mobile Optimized */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 border border-blue-100 shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 animate-fade-in">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-purple-700 mb-1 sm:mb-2 flex justify-center items-center gap-2">
            <Wrench className="inline h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
            Content Creation Tools
            <span className="font-mono rounded-full bg-blue-200 px-1.5 sm:px-2 py-0.5 ml-1 sm:ml-2 text-xs text-blue-700">{TOOLS_LIST.length}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 text-center mb-3 sm:mb-4">Write, generate, and create with ease. Discover all tools below:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-w-4xl mx-auto">
            {TOOLS_LIST.map((tool, i) => (
              <Card
                key={tool.name}
                className="flex flex-row items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border-0 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-2 sm:p-3 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-gradient-to-r from-purple-400 to-blue-400 flex-shrink-0">
                  <tool.icon className="text-white h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-xs sm:text-sm truncate">{tool.name}</div>
                  <div className="text-xs text-gray-500 line-clamp-2 leading-tight">{tool.desc}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* About Creator - Mobile Optimized */}
        <div className="flex justify-center w-full mb-4 sm:mb-6 animate-fade-in">
          <Card className="w-full max-w-md border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-4 sm:p-5 text-center">
              <div className="flex justify-center mb-2 sm:mb-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 flex items-center justify-center gap-1">
                Made with <span className="text-red-400 text-lg sm:text-xl">❤️</span> by Sajid
              </h2>
              <p className="text-blue-100 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed px-2">
                Crafted with passion and dedication to bring you the best AI experience.<br/>
                Constantly evolving to meet your needs and exceed your expectations.
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center space-x-1">
                  <Code className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Built with React</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>User Focused</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>AI Enhanced</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Limits - Mobile Optimized */}
        <Card className="border-0 shadow-lg bg-amber-50/90 backdrop-blur-sm border border-amber-200 mb-4 sm:mb-6 animate-fade-in">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-amber-800 flex items-center space-x-2 text-sm sm:text-base">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Daily Usage Limits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="flex justify-between items-center">
              <span className="text-amber-700 text-xs sm:text-sm">Chat Messages</span>
              <Badge className="bg-amber-200 text-amber-800 text-xs">10 per day</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-700 text-xs sm:text-sm">Tool Generations</span>
              <Badge className="bg-amber-200 text-amber-800 text-xs">6 per day</Badge>
            </div>
            <p className="text-xs text-amber-600 mt-2 leading-relaxed">
              Limits reset daily at midnight (12:00 AM) to ensure fair usage for everyone! ⭐
            </p>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-100 border rounded-lg sm:rounded-xl border-amber-200 px-3 sm:px-4 py-2 sm:py-3 mt-2 text-amber-700 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <strong className="block mb-1">Want to extend your limits or unlock more?</strong>
                Upgrading will soon be available! For early access or to request higher limits, please&nbsp;
                <a href="mailto:support@makab.ai" className="underline text-blue-600 hover:text-blue-900">contact support</a>.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Section - Mobile Optimized */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-blue-600 text-white overflow-hidden animate-fade-in">
          <CardContent className="p-4 sm:p-5 text-center">
            <div className="flex justify-center mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Share className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">Share MAKAB</h2>
            <p className="text-green-100 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed px-2">
              Help others discover the power of AI-assisted content creation
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
              <Button
                onClick={() => handleShare('whatsapp')}
                className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:scale-105"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
                WhatsApp
              </Button>
              <Button
                onClick={() => handleShare('facebook')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:scale-105"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
