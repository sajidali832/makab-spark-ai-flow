import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ToolForm from './ToolForm';

const tools = [
  {
    id: 'caption',
    title: 'Caption Generator',
    description: 'Generate engaging captions for your social media posts',
    icon: '📝',
    color: 'from-blue-500 to-cyan-500',
    inputs: [
      { name: 'topic', label: 'Topic / About', type: 'textarea' as const, placeholder: 'e.g., My trip to the Swiss Alps, a new product launch...' },
      { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Casual', 'Professional', 'Witty', 'Inspirational', 'Friendly'], placeholder: 'Select a tone' },
      { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'Facebook', 'Twitter/X', 'LinkedIn', 'TikTok', 'Other'], placeholder: 'Choose platform' },
      { name: 'audience', label: 'Audience', type: 'text' as const, placeholder: 'Who is this for? (e.g., travelers, marketers, everyone)' },
      { name: 'cta', label: 'Call-to-Action (Optional)', type: 'text' as const, placeholder: 'e.g., Follow for more, Shop now' }
    ]
  },
  {
    id: 'hashtag',
    title: 'Hashtag Generator',
    description: 'Create relevant hashtags to boost your post visibility',
    icon: '#️⃣',
    color: 'from-green-500 to-emerald-500',
    inputs: [
      { name: 'topic', label: 'Topic / Keywords', type: 'textarea' as const, placeholder: 'e.g., sustainable fashion, travel photography' },
      { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'Facebook', 'Twitter/X', 'LinkedIn', 'TikTok', 'Other'], placeholder: 'Choose platform' },
      { name: 'count', label: 'Number of Hashtags', type: 'select' as const, options: ['10', '15', '20', '25'], placeholder: 'Select count' },
      { name: 'niche', label: 'Niche (Optional)', type: 'text' as const, placeholder: 'e.g., fitness, art, tech' }
    ]
  },
  {
    id: 'thread-generator',
    title: 'Thread Generator',
    description: 'Create engaging Twitter/X threads that tell a story',
    icon: '🧵',
    color: 'from-purple-500 to-indigo-500',
    inputs: [
      { name: 'topic', label: 'Main topic of the thread', type: 'textarea' as const, placeholder: 'e.g., The history of AI, 10 tips for better productivity...' },
      { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Twitter/X', 'LinkedIn'], placeholder: 'Choose platform' },
      { name: 'purpose', label: 'Purpose', type: 'select' as const, options: ['Educate', 'Inspire', 'Entertain', 'Share Story', 'Other'], placeholder: 'Purpose of the thread' },
      { name: 'threadLength', label: 'Thread Length', type: 'select' as const, options: ['Short (3-4 tweets)', 'Medium (5-7 tweets)', 'Long (8+ tweets)'], placeholder: 'Select length' },
      { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Friendly', 'Professional', 'Witty', 'Bold', 'Inspirational'], placeholder: 'Thread tone' },
      { name: 'audience', label: 'Audience', type: 'text' as const, placeholder: 'Who is this for?' },
      { name: 'cta', label: 'Call-to-Action (Optional)', type: 'text' as const, placeholder: 'e.g., Retweet, Share, Learn more' }
    ]
  },
  {
    id: 'story-ideas',
    title: 'Story Ideas',
    description: 'Get creative ideas for your Instagram and Facebook stories',
    icon: '💡',
    color: 'from-orange-500 to-red-500',
    inputs: [
      { name: 'topic', label: 'Topic / Theme', type: 'text' as const, placeholder: 'e.g., behind the scenes, Q&A session, daily routine' },
      { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'Facebook', 'TikTok', 'Other'], placeholder: 'Choose platform' },
      { name: 'audience', label: 'Audience', type: 'text' as const, placeholder: 'e.g., Fitness lovers, Entrepreneurs' }
    ]
  },
  {
    id: 'bio-generator',
    title: 'Bio Generator',
    description: 'Create compelling bios for your social media profiles',
    icon: '👤',
    color: 'from-pink-500 to-rose-500',
    inputs: [
      { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'Twitter/X', 'LinkedIn', 'Other'], placeholder: 'Choose platform' },
      { name: 'profession', label: 'Profession / Role', type: 'text' as const, placeholder: 'e.g., Marketer, Artist' },
      { name: 'personality', label: 'Personality', type: 'text' as const, placeholder: 'e.g., Driven, Adventurous' },
      { name: 'achievements', label: 'Achievements (Optional)', type: 'text' as const, placeholder: 'e.g., Award-winner, 100K followers' },
      { name: 'interests', label: 'Interests (Optional)', type: 'text' as const, placeholder: 'e.g., Hiking, Photography' },
      { name: 'cta', label: 'Call-to-Action (Optional)', type: 'text' as const, placeholder: 'e.g., Follow for tips' },
      { name: 'emojiStyle', label: 'Emoji Style', type: 'select' as const, options: ['Minimal', 'Casual', 'Playful', 'Professional'], placeholder: 'Choose emoji style' }
    ]
  },
  {
    id: 'ad-copy',
    title: 'Ad Copy Generator',
    description: 'Generate persuasive ad copy for your marketing campaigns',
    icon: '🎯',
    color: 'from-teal-500 to-cyan-500',
    inputs: [
      { name: 'product', label: 'Product / Service Name', type: 'text' as const, placeholder: 'e.g., CleanBee Vacuum, Pro-Web Design Services' },
      { name: 'description', label: 'Product / Service Description', type: 'textarea' as const, placeholder: 'Describe what it is and its main benefits.' },
      { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'e.g., busy homeowners, small business owners' },
      { name: 'keywords', label: 'Keywords (Optional)', type: 'text' as const, placeholder: 'e.g., affordable, powerful, time-saving' }
    ]
  },
  {
    id: 'script-generator',
    title: 'Video Script Generator',
    description: 'Create scripts for YouTube, Reels, and TikTok with structure and hooks',
    icon: '🎬',
    color: 'from-red-500 to-yellow-400',
    inputs: [
      { name: 'topic', label: 'Video Topic', type: 'textarea' as const, placeholder: 'e.g., How to grow on YouTube' },
      { name: 'duration', label: 'Video Duration', type: 'select' as const, options: ['Short (30s-1min)', 'Medium (1-3 min)', 'Long (5+ min)'], placeholder: 'Select duration' },
      { name: 'platform', label: 'Platform', type: 'select' as const, options: ['YouTube', 'Instagram Reels', 'TikTok', 'Other'], placeholder: 'Choose platform' },
      { name: 'style', label: 'Style', type: 'select' as const, options: ['Conversational', 'Educational', 'Funny', 'Sales'], placeholder: 'Choose style' },
      { name: 'audience', label: 'Audience', type: 'text' as const, placeholder: 'Who is this for?' },
      { name: 'keywords', label: 'Keywords (Optional)', type: 'text' as const, placeholder: 'e.g., SEO, growth, viral' },
      { name: 'cta', label: 'Call to Action (Optional)', type: 'text' as const, placeholder: 'e.g., Subscribe & like' }
    ]
  },
  {
    id: 'blog-generator',
    title: 'Blog Post Generator',
    description: 'Write long-form blog content based on your topic and specs',
    icon: '✍️',
    color: 'from-amber-400 to-orange-500',
    inputs: [
      { name: 'topic', label: 'Blog Topic', type: 'textarea' as const, placeholder: 'e.g., The Future of Social Media' },
      { name: 'length', label: 'Blog Length', type: 'select' as const, options: ['Short (300-500 words)', 'Medium (500-1200 words)', 'Long (1200+ words)'], placeholder: 'Select length' },
      { name: 'structure', label: 'Post Structure', type: 'select' as const, options: ['Standard', 'Listicle', 'How-To', 'Case Study'], placeholder: 'Structure' },
      { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Professional', 'Conversational', 'Witty', 'Bold'], placeholder: 'Select tone' },
      { name: 'audience', label: 'Audience', type: 'text' as const, placeholder: 'e.g., small businesses, designers' },
      { name: 'keywords', label: 'SEO Keywords (Optional)', type: 'text' as const, placeholder: 'e.g., marketing, growth' },
      { name: 'cta', label: 'Call-to-Action (Optional)', type: 'text' as const, placeholder: 'e.g., Download our guide' }
    ]
  },
  {
    id: 'reel-ideas',
    title: 'Reel & Shorts Ideas',
    description: 'Inspire yourself with short video content ideas for any platform',
    icon: '📹',
    color: 'from-fuchsia-500 to-pink-400',
    inputs: [
      { name: 'niche', label: 'Niche', type: 'text' as const, placeholder: 'e.g., Cooking, Fitness, Marketing' },
      { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'YouTube Shorts', 'TikTok'], placeholder: 'Choose platform' },
      { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'e.g., Gen Z, busy moms' },
      { name: 'trendType', label: 'Trend Type', type: 'select' as const, options: ['Trending audio', 'How-to', 'Funny', 'Educational'], placeholder: 'Choose trend type' },
      { name: 'goals', label: 'Content Goals', type: 'text' as const, placeholder: 'e.g., Awareness, Engagement, Leads' },
      { name: 'style', label: 'Video Style', type: 'select' as const, options: ['Fast cuts', 'Storytelling', 'Interviews'], placeholder: 'Choose style' },
      { name: 'duration', label: 'Duration', type: 'select' as const, options: ['15s', '30s', '60s', '90s+'], placeholder: 'Pick duration' }
    ]
  },
  {
    id: 'engagement-questions',
    title: 'Engagement Questions',
    description: 'Generate questions for comments, stories, lives, polls, and more.',
    icon: '❓',
    color: 'from-blue-400 to-indigo-400',
    inputs: [
      { name: 'quantity', label: 'How Many?', type: 'select' as const, options: ['3', '5', '10', '15'], placeholder: 'Number of questions' },
      { name: 'questionType', label: 'Question Type', type: 'select' as const, options: ['Open-ended', 'Quick poll', 'Funny', 'Deep'], placeholder: 'Type' },
      { name: 'contentType', label: 'Content Type', type: 'select' as const, options: ['Story', 'Post', 'Reel', 'Live', 'Poll'], placeholder: 'Use for' },
      { name: 'topic', label: 'Topic / Theme', type: 'textarea' as const, placeholder: 'e.g., productivity, travel, finance' },
      { name: 'audience', label: 'Audience', type: 'text' as const, placeholder: 'e.g., Freelancers, Parents, All' },
      { name: 'engagementGoal', label: 'Engagement Goal', type: 'text' as const, placeholder: 'e.g., Get replies, fun interactions, debate' },
      { name: 'industry', label: 'Industry (Optional)', type: 'text' as const, placeholder: 'e.g., Tech, Wellness' }
    ]
  },
  {
    id: 'idea',
    title: 'Content Idea Generator',
    description: 'Get fresh, actionable ideas for any kind of content.',
    icon: '🌟',
    color: 'from-emerald-500 to-green-400',
    inputs: [
      { name: 'quantity', label: 'How Many?', type: 'select' as const, options: ['3', '5', '10', '15'], placeholder: 'Number of ideas' },
      { name: 'niche', label: 'Niche', type: 'text' as const, placeholder: 'e.g., Fitness, Tech, Education' },
      { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Instagram', 'YouTube', 'Blog', 'Podcast', 'Other'], placeholder: 'Choose platform' },
      { name: 'contentType', label: 'Content Type', type: 'select' as const, options: ['Post', 'Video', 'Story', 'Podcast'], placeholder: 'Content type' },
      { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'e.g., Entrepreneurs, Teens, Moms' },
      { name: 'goals', label: 'Goals', type: 'text' as const, placeholder: 'e.g., Sales, Traffic, Engagement' }
    ]
  },
  {
    id: 'youtube',
    title: 'YouTube Channel Strategy',
    description: 'Get a complete channel strategy including ideas and monetization.',
    icon: '📺',
    color: 'from-red-400 to-lime-400',
    inputs: [
      { name: 'niche', label: 'YouTube Niche', type: 'text' as const, placeholder: 'e.g., Gaming, Education, Tech' },
      { name: 'audience', label: 'Audience', type: 'text' as const, placeholder: 'e.g., College students, Families' },
      { name: 'contentStyle', label: 'Content Style', type: 'select' as const, options: ['Tutorials', 'Reviews', 'Vlogs', 'Documentaries'], placeholder: 'Choose style' },
      { name: 'experience', label: 'Experience Level', type: 'select' as const, options: ['Beginner', 'Intermediate', 'Expert'], placeholder: 'Level' },
      { name: 'goals', label: 'Goals', type: 'text' as const, placeholder: 'e.g., Monetization, Growth' },
      { name: 'frequency', label: 'Upload Frequency', type: 'select' as const, options: ['1/week', '2-3/week', 'Daily'], placeholder: 'Choose frequency' }
    ]
  },
  {
    id: 'email-subject',
    title: 'Email Subject Line Generator',
    description: 'Create catchy, high-conversion email subject lines.',
    icon: '✉️',
    color: 'from-cyan-500 to-teal-300',
    inputs: [
      { name: 'quantity', label: 'How Many?', type: 'select' as const, options: ['5', '10', '20'], placeholder: 'Number of subject lines' },
      { name: 'emailType', label: 'Email Type', type: 'select' as const, options: ['Newsletter', 'Promo', 'Announcement', 'Welcome', 'Follow Up'], placeholder: 'Type of email' },
      { name: 'topic', label: 'Email Topic', type: 'textarea' as const, placeholder: 'e.g., Summer sale, Product launch' },
      { name: 'audience', label: 'Audience', type: 'text' as const, placeholder: 'e.g., Customers, Subscribers' },
      { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Urgent', 'Friendly', 'Formal', 'Playful'], placeholder: 'Select tone' },
      { name: 'goal', label: 'Primary Goal', type: 'text' as const, placeholder: 'e.g., Get clicks, Announce' },
      { name: 'keywords', label: 'Keywords (Optional)', type: 'text' as const, placeholder: 'e.g., discount, event' }
    ]
  },
  {
    id: 'linkedin-post',
    title: 'LinkedIn Post Generator',
    description: 'Generate professional posts for LinkedIn',
    icon: '💼',
    color: 'from-blue-800 to-gray-400',
    inputs: [
      { name: 'topic', label: 'Post Topic', type: 'textarea' as const, placeholder: 'e.g., Remote work strategies' },
      { name: 'length', label: 'Post Length', type: 'select' as const, options: ['Short', 'Medium', 'Long'], placeholder: 'Choose length' },
      { name: 'postType', label: 'Post Type', type: 'select' as const, options: ['Insight', 'Case Study', 'Announcement'], placeholder: 'Choose post type' },
      { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Professional', 'Conversational', 'Witty'], placeholder: 'Choose tone' },
      { name: 'industry', label: 'Industry', type: 'text' as const, placeholder: 'e.g., Marketing, SaaS' },
      { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'e.g., HR Managers, Startups' },
      { name: 'cta', label: 'Call-to-Action (Optional)', type: 'text' as const, placeholder: 'e.g., Book a call' }
    ]
  },
  {
    id: 'image-prompt',
    title: 'AI Image Prompt Generator',
    description: 'Create detailed prompts for generating images with AI art tools.',
    icon: '🖼️',
    color: 'from-lime-400 to-teal-300',
    inputs: [
      { name: 'subject', label: 'Subject', type: 'text' as const, placeholder: 'e.g., Mountain sunrise landscape' },
      { name: 'style', label: 'Art Style', type: 'text' as const, placeholder: 'e.g., Watercolor, Cyberpunk' },
      { name: 'mood', label: 'Mood/Atmosphere', type: 'text' as const, placeholder: 'e.g., Dreamy, Energetic' },
      { name: 'setting', label: 'Setting/Background', type: 'text' as const, placeholder: 'e.g., Forest, Urban skyline' },
      { name: 'colors', label: 'Color Palette', type: 'text' as const, placeholder: 'e.g., Pastel, Bold, Black & White' },
      { name: 'perspective', label: 'Camera Angle/Perspective', type: 'text' as const, placeholder: 'e.g., Eye-level, Aerial view' },
      { name: 'details', label: 'Additional Details (Optional)', type: 'text' as const, placeholder: 'e.g., add birds in sky' }
    ]
  },
  {
    id: 'seo-title',
    title: 'SEO Title Generator',
    description: 'Generate SEO-optimized titles for articles, videos, or pages.',
    icon: '🔍',
    color: 'from-gray-400 to-lime-500',
    inputs: [
      { name: 'quantity', label: 'How Many?', type: 'select' as const, options: ['5', '10', '15'], placeholder: 'Number of titles' },
      { name: 'contentType', label: 'Content Type', type: 'select' as const, options: ['Blog Post', 'YouTube Video', 'Landing Page'], placeholder: 'Select content type' },
      { name: 'topic', label: 'Topic', type: 'textarea' as const, placeholder: 'e.g., Email marketing strategies' },
      { name: 'keywords', label: 'Primary Keywords', type: 'text' as const, placeholder: 'e.g., Growth hacks, Social media' },
      { name: 'audience', label: 'Audience', type: 'text' as const, placeholder: 'e.g., Marketers, Small business owners' },
      { name: 'intent', label: 'Search Intent', type: 'select' as const, options: ['Transactional', 'Informational', 'Navigational'], placeholder: 'Choose intent' },
      { name: 'titleStyle', label: 'Title Style', type: 'select' as const, options: ['Listicle', 'How-To', 'Guide', 'Case Study'], placeholder: 'Choose style' }
    ]
  }
];

const ToolsSection = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const selectedToolData = tools.find(tool => tool.id === selectedTool);

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

  if (selectedTool && selectedToolData) {
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
          <ToolForm tool={selectedToolData} />
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
                    {tool.title}
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
