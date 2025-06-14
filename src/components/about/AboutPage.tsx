
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  UserCheck
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

        {/* Boosted Tools Section - Show ALL 14 Tools */}
        <div
          className="
            rounded-3xl bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 border border-blue-100 shadow-xl
            px-1 sm:px-6 py-5 sm:py-8 mb-7 sm:mb-10
            animate-fade-in
          "
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center text-purple-700 mb-1 flex justify-center items-center gap-2">
            <Wrench className="inline h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            Content Creation Tools
            <span className="font-mono rounded-full bg-blue-200 px-2 py-0.5 ml-2 text-xs text-blue-700">{TOOLS_LIST.length}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 text-center mb-4">Write, generate, and create with ease. Discover all tools below:</p>
          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4
              max-w-3xl mx-auto
            "
          >
            {TOOLS_LIST.map((tool, i) => (
              <Card
                key={tool.name}
                className="
                  flex flex-row items-center gap-2 rounded-xl border-0 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-3 shadow-md hover:shadow-xl
                  transition-all duration-200 hover:scale-105
                  group
                "
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-400 to-blue-400 mr-2">
                  <tool.icon className="text-white h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800 text-xs sm:text-sm">{tool.name}</div>
                  <div className="text-[11px] sm:text-xs text-gray-500">{tool.desc}</div>
                </div>
              </Card>
            ))}
          </div>
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

        {/* Usage Limits Info + Upgrade Note */}
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
              <Badge className="bg-amber-200 text-amber-800 text-xs">10 per day</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-700 text-xs sm:text-sm">Tool Generations</span>
              <Badge className="bg-amber-200 text-amber-800 text-xs">6 per day</Badge>
            </div>
            <p className="text-xs text-amber-600 mt-2">
              Limits reset daily at midnight (12:00 AM) to ensure fair usage for everyone! ⭐
            </p>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-100 border rounded-xl border-amber-200 px-4 py-3 mt-2 text-amber-700 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-400 mt-0.5" />
              <div>
                <strong>Want to extend your limits or unlock more?</strong>
                <div className="text-xs">
                  Upgrading will soon be available! For early access or to request higher limits, please&nbsp;
                  <a href="mailto:support@makab.ai" className="underline text-blue-600 hover:text-blue-900">contact support</a>
                  .
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;

