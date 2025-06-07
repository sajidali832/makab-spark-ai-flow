import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, Check, Sparkles, Zap, Stars, RefreshCw, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LimitExceededModal from '../LimitExceededModal';
import { useDailyLimits } from '@/hooks/useDailyLimits';

interface ToolFormProps {
  toolType: string;
  onBack: () => void;
}

const ToolForm = ({ toolType, onBack }: ToolFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const { toast } = useToast();
  const { canUseTools, incrementToolGenerations, remainingGenerations } = useDailyLimits();

  const toolConfigs: Record<string, any> = {
    'caption': {
      title: 'Caption Generator',
      description: 'Create engaging social media captions',
      fields: [
        { name: 'topic', label: 'Post Topic', type: 'text', required: true, placeholder: 'What is your post about?' },
        { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'General'] },
        { name: 'tone', label: 'Tone', type: 'select', required: true, options: ['Professional', 'Casual', 'Funny', 'Inspirational', 'Educational', 'Promotional'] },
        { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Who is your target audience?' },
        { name: 'cta', label: 'Call-to-Action', type: 'text', placeholder: 'What action should followers take?' },
        { name: 'keywords', label: 'Keywords', type: 'text', placeholder: 'Enter keywords separated by commas' }
      ]
    },
    'hashtag': {
      title: 'Hashtag Generator',
      description: 'Generate trending hashtags for your content',
      fields: [
        { name: 'topic', label: 'Content Topic', type: 'text', required: true, placeholder: 'What is your content about?' },
        { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['Instagram', 'Twitter', 'TikTok', 'LinkedIn', 'Facebook', 'YouTube'] },
        { name: 'niche', label: 'Niche/Industry', type: 'text', required: true, placeholder: 'Your industry or niche' },
        { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Describe your audience' },
        { name: 'count', label: 'Number of Hashtags', type: 'select', required: true, options: ['10 hashtags', '20 hashtags', '30 hashtags', '50 hashtags'] },
        { name: 'mix', label: 'Hashtag Mix', type: 'select', required: true, options: ['Popular + Niche', 'Trending Focus', 'Niche Focus', 'Branded Focus'] }
      ]
    },
    'idea': {
      title: 'Content Idea Generator',
      description: 'Spark creative content ideas for your brand',
      fields: [
        { name: 'niche', label: 'Content Niche', type: 'text', required: true, placeholder: 'Your content niche or industry' },
        { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['Instagram', 'YouTube', 'TikTok', 'Facebook', 'LinkedIn', 'Blog', 'All Platforms'] },
        { name: 'content_type', label: 'Content Type', type: 'select', required: true, options: ['Posts', 'Videos', 'Stories', 'Reels', 'Blog Posts', 'Mixed Content'] },
        { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Describe your target audience' },
        { name: 'goals', label: 'Content Goals', type: 'select', required: true, options: ['Engagement', 'Education', 'Entertainment', 'Sales', 'Brand Awareness', 'Community Building'] },
        { name: 'quantity', label: 'Number of Ideas', type: 'select', required: true, options: ['5 ideas', '10 ideas', '15 ideas', '20 ideas'] }
      ]
    },
    'youtube': {
      title: 'YouTube Channel Ideas',
      description: 'Build your YouTube presence with creative channel ideas',
      fields: [
        { name: 'niche', label: 'Channel Niche', type: 'text', required: true, placeholder: 'What niche do you want to focus on?' },
        { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Who is your target audience?' },
        { name: 'content_style', label: 'Content Style', type: 'select', required: true, options: ['Educational', 'Entertainment', 'Lifestyle', 'Gaming', 'Tech Reviews', 'How-to Tutorials', 'Vlogs'] },
        { name: 'experience', label: 'Your Experience Level', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
        { name: 'goals', label: 'Channel Goals', type: 'select', required: true, options: ['Build Community', 'Generate Income', 'Share Knowledge', 'Entertainment', 'Brand Building'] },
        { name: 'frequency', label: 'Upload Frequency', type: 'select', required: true, options: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'] }
      ]
    },
    'bio': {
      title: 'Bio Generator',
      description: 'Craft perfect profile bios for social media',
      fields: [
        { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok', 'General'] },
        { name: 'profession', label: 'Profession/Role', type: 'text', required: true, placeholder: 'What do you do?' },
        { name: 'personality', label: 'Personality', type: 'select', required: true, options: ['Professional', 'Creative', 'Fun & Quirky', 'Inspirational', 'Minimalist', 'Bold'] },
        { name: 'achievements', label: 'Key Achievements', type: 'text', placeholder: 'Your main accomplishments or credentials' },
        { name: 'interests', label: 'Interests/Hobbies', type: 'text', placeholder: 'Your interests outside of work' },
        { name: 'cta', label: 'Call-to-Action', type: 'text', placeholder: 'What should people do? (DM, visit website, etc.)' },
        { name: 'emoji_style', label: 'Emoji Style', type: 'select', required: true, options: ['No Emojis', 'Minimal Emojis', 'Moderate Emojis', 'Lots of Emojis'] }
      ]
    },
    'script-generator': {
      title: 'Script Generator',
      description: 'Generate engaging scripts for videos, presentations, or content',
      fields: [
        { name: 'topic', label: 'Topic/Subject', type: 'text', required: true, placeholder: 'Enter the main topic or subject' },
        { name: 'tone', label: 'Tone', type: 'select', required: true, options: ['Professional', 'Casual', 'Humorous', 'Educational', 'Inspirational', 'Dramatic'] },
        { name: 'duration', label: 'Target Duration', type: 'select', required: true, options: ['30 seconds', '1 minute', '2-3 minutes', '5 minutes', '10+ minutes'] },
        { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Who is your target audience?' },
        { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['YouTube', 'Instagram', 'TikTok', 'LinkedIn', 'Facebook', 'General'] },
        { name: 'style', label: 'Script Style', type: 'select', required: true, options: ['Monologue', 'Dialogue', 'Interview', 'Tutorial', 'Storytelling', 'Documentary'] },
        { name: 'keywords', label: 'Keywords to Include', type: 'text', placeholder: 'Enter keywords separated by commas' }
      ]
    },
    'blog-generator': {
      title: 'Blog Post Generator',
      description: 'Create comprehensive blog posts on any topic',
      fields: [
        { name: 'topic', label: 'Blog Topic', type: 'text', required: true, placeholder: 'Enter your blog post topic' },
        { name: 'tone', label: 'Writing Tone', type: 'select', required: true, options: ['Professional', 'Casual', 'Academic', 'Conversational', 'Technical', 'Creative'] },
        { name: 'length', label: 'Post Length', type: 'select', required: true, options: ['Short (300-500 words)', 'Medium (500-1000 words)', 'Long (1000-2000 words)', 'Extended (2000+ words)'] },
        { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Describe your target readers' },
        { name: 'keywords', label: 'SEO Keywords', type: 'text', placeholder: 'Enter SEO keywords separated by commas' },
        { name: 'structure', label: 'Content Structure', type: 'select', required: true, options: ['How-to Guide', 'Listicle', 'Opinion Piece', 'Case Study', 'Tutorial', 'News Article'] },
        { name: 'cta', label: 'Call-to-Action', type: 'text', placeholder: 'What action should readers take?' }
      ]
    },
    'reel-ideas': {
      title: 'Reel Idea Generator',
      description: 'Generate creative and trending reel ideas for social media',
      fields: [
        { name: 'niche', label: 'Content Niche', type: 'text', required: true, placeholder: 'e.g., fitness, cooking, business, lifestyle' },
        { name: 'platform', label: 'Platform', type: 'select', required: true, options: ['Instagram Reels', 'TikTok', 'YouTube Shorts', 'Facebook Reels', 'All Platforms'] },
        { name: 'trend_type', label: 'Trend Type', type: 'select', required: true, options: ['Viral Challenges', 'Educational Content', 'Behind the Scenes', 'Tutorials', 'Entertainment', 'Trending Audio'] },
        { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Age group and demographics' },
        { name: 'goals', label: 'Content Goals', type: 'select', required: true, options: ['Increase Engagement', 'Gain Followers', 'Drive Sales', 'Brand Awareness', 'Education', 'Entertainment'] },
        { name: 'style', label: 'Content Style', type: 'select', required: true, options: ['Quick Tips', 'Storytelling', 'Comedy', 'Aesthetic', 'Motivational', 'Educational'] },
        { name: 'duration', label: 'Video Duration', type: 'select', required: true, options: ['15 seconds', '30 seconds', '60 seconds', '90 seconds'] }
      ]
    },
    'engagement-questions': {
      title: 'Engagement Question Generator',
      description: 'Create engaging questions for stories and posts to boost interaction',
      fields: [
        { name: 'content_type', label: 'Content Type', type: 'select', required: true, options: ['Instagram Stories', 'Facebook Posts', 'LinkedIn Posts', 'Twitter Polls', 'General Social Media'] },
        { name: 'topic', label: 'Topic/Theme', type: 'text', required: true, placeholder: 'What topic should the questions relate to?' },
        { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Describe your audience' },
        { name: 'question_type', label: 'Question Type', type: 'select', required: true, options: ['This or That', 'Opinion Questions', 'Personal Questions', 'Fun Questions', 'Professional Questions', 'Mixed'] },
        { name: 'engagement_goal', label: 'Engagement Goal', type: 'select', required: true, options: ['Increase Comments', 'Drive Story Replies', 'Start Conversations', 'Gather Feedback', 'Build Community'] },
        { name: 'quantity', label: 'Number of Questions', type: 'select', required: true, options: ['5 questions', '10 questions', '15 questions', '20 questions'] },
        { name: 'industry', label: 'Industry/Niche', type: 'text', placeholder: 'Your business industry or content niche' }
      ]
    }
  };

  const currentTool = toolConfigs[toolType];
  if (!currentTool) return null;

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    console.log('Generate button clicked');
    console.log('Can use tools:', canUseTools());
    console.log('Remaining generations:', remainingGenerations);

    // Check limits BEFORE attempting to generate
    if (!canUseTools()) {
      console.log('Opening limit modal - no generations left');
      setLimitModalOpen(true);
      return;
    }

    // Try to increment first
    if (!incrementToolGenerations()) {
      console.log('Failed to increment tool generations');
      setLimitModalOpen(true);
      return;
    }

    console.log('Starting content generation...');
    setIsGenerating(true);
    setGeneratedContent('');

    try {
      // Create a proper user object for authentication
      let user = { id: 'anonymous_user' };
      try {
        const storedUser = localStorage.getItem('makab_user');
        if (storedUser) {
          user = JSON.parse(storedUser);
        }
      } catch (e) {
        console.log('No stored user found, using anonymous user');
      }

      console.log('Making API call to tools-generation function...');
      console.log('Form data:', formData);
      console.log('Tool type:', toolType);

      const { data, error } = await supabase.functions.invoke('tools-generation', {
        body: {
          toolType,
          inputData: formData,
          userId: user.id
        }
      });

      console.log('API response received:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate content');
      }

      if (!data || !data.generatedContent) {
        console.error('No content in response:', data);
        throw new Error('No content received from the server');
      }

      console.log('Content generation successful');
      setGeneratedContent(data.generatedContent);
      
      toast({
        title: "🎉 Content Generated Successfully!",
        description: "Your amazing content is ready to use",
      });
    } catch (error: any) {
      console.error('Content generation failed:', error);
      
      toast({
        title: "⚠️ Generation Failed",
        description: error.message || "Something went wrong. Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, section: string = 'all') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [section]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [section]: false })), 2000);
      toast({
        title: "📋 Copied Successfully!",
        description: "Content is now in your clipboard",
      });
    } catch (error) {
      toast({
        title: "❌ Copy Failed",
        description: "Unable to copy content to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadAsFile = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${toolType}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "📥 Download Started!",
      description: "Your content file is being downloaded",
    });
  };

  const saveContent = () => {
    const savedContent = localStorage.getItem('savedContent') || '[]';
    const content = JSON.parse(savedContent);
    content.push({
      id: Date.now(),
      type: toolType,
      content: generatedContent,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('savedContent', JSON.stringify(content));
    
    toast({
      title: "💾 Content Saved!",
      description: "Content saved to your local storage",
    });
  };

  const parseGeneratedContent = (content: string) => {
    const sections: { title: string; content: string; type: string }[] = [];
    
    if (toolType === 'caption') {
      const captionMatch = content.match(/Caption[s]?:?\s*([\s\S]*?)(?=\n\n|Hashtags|$)/i);
      const hashtagMatch = content.match(/Hashtags?:?\s*([\s\S]*?)(?=\n\n|$)/i);
      
      if (captionMatch) {
        sections.push({
          title: 'Caption',
          content: captionMatch[1].trim(),
          type: 'caption'
        });
      }
      
      if (hashtagMatch) {
        sections.push({
          title: 'Hashtags',
          content: hashtagMatch[1].trim(),
          type: 'hashtags'
        });
      }
    } else if (toolType === 'hashtag') {
      sections.push({
        title: 'Hashtags',
        content: content,
        type: 'hashtags'
      });
    } else if (toolType === 'engagement-questions') {
      const questionBlocks = content.split('\n\n').filter(block => block.trim());
      questionBlocks.forEach((block, index) => {
        if (block.trim()) {
          sections.push({
            title: `Question ${index + 1}`,
            content: block.trim(),
            type: 'question'
          });
        }
      });
    } else {
      sections.push({
        title: 'Generated Content',
        content: content,
        type: 'general'
      });
    }
    
    return sections;
  };

  const canGenerate = currentTool.fields
    .filter((field: any) => field.required)
    .every((field: any) => formData[field.name]?.trim());

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="flex items-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
        <Button onClick={onBack} variant="outline" size="sm">
          ← Back
        </Button>
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">{currentTool.title}</h2>
          <p className="text-sm sm:text-base text-gray-600">{currentTool.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Input Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {currentTool.fields.map((field: any) => (
              <div key={field.name} className="space-y-1 sm:space-y-2">
                <Label htmlFor={field.name} className="text-sm">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === 'text' && (
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full text-sm"
                  />
                )}
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full min-h-[80px] text-sm"
                  />
                )}
                {field.type === 'select' && (
                  <Select
                    value={formData[field.name] || ''}
                    onValueChange={(value) => handleInputChange(field.name, value)}
                  >
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option: string) => (
                        <SelectItem key={option} value={option} className="text-sm">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
            
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span>Creating Magic...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Generate Content</span>
                </div>
              )}
            </Button>

            {/* Show remaining generations for transparency */}
            <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-blue-600 mb-1">
                <Stars className="h-4 w-4" />
                <span className="font-semibold text-sm">Daily Usage</span>
              </div>
              <p className="text-xs text-blue-500">
                {remainingGenerations} generations remaining today
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generated Content</CardTitle>
              {generatedContent && (
                <div className="flex space-x-1 sm:space-x-2">
                  <Button
                    onClick={handleGenerate}
                    variant="outline"
                    size="sm"
                    className="flex items-center text-xs sm:text-sm transition-all duration-200 hover:scale-105"
                    disabled={isGenerating}
                  >
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Regenerate
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(generatedContent)}
                    variant="outline"
                    size="sm"
                    className="flex items-center text-xs sm:text-sm transition-all duration-200 hover:scale-105"
                  >
                    {copied.all ? (
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    )}
                    Copy All
                  </Button>
                  <Button
                    onClick={saveContent}
                    variant="outline"
                    size="sm"
                    className="flex items-center text-xs sm:text-sm transition-all duration-200 hover:scale-105"
                  >
                    <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={downloadAsFile}
                    variant="outline"
                    size="sm"
                    className="flex items-center text-xs sm:text-sm transition-all duration-200 hover:scale-105"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-6">
                {/* Enhanced loading animation */}
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 opacity-30"></div>
                  <div className="absolute inset-2 animate-pulse rounded-full h-12 w-12 border-4 border-purple-400 opacity-40"></div>
                  <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 border-r-purple-600 border-b-pink-600 border-l-indigo-600"></div>
                  <div className="absolute inset-4 animate-bounce">
                    <Sparkles className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                {/* Animated text */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 animate-pulse">
                    ✨ Crafting Your Content ✨
                  </h3>
                  <p className="text-sm text-gray-600">
                    Our AI is working its magic...
                  </p>
                  
                  {/* Animated dots */}
                  <div className="flex justify-center space-x-2 mt-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
                
                {/* Progress bars */}
                <div className="w-full max-w-xs space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
              </div>
            ) : generatedContent ? (
              <div className="space-y-3 sm:space-y-4 animate-fade-in">
                {parseGeneratedContent(generatedContent).map((section, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                      <h4 className="font-medium text-sm text-gray-700">{section.title}</h4>
                      <Button
                        onClick={() => copyToClipboard(section.content, `section-${index}`)}
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs hover:bg-gray-200"
                      >
                        {copied[`section-${index}`] ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className="p-3 bg-white">
                      <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-800 font-mono leading-relaxed">
                        {section.content}
                      </pre>
                    </div>
                  </div>
                ))}
                <div className="text-xs text-gray-500 text-center bg-green-50 border border-green-200 rounded-lg p-2">
                  🎉 Content generated successfully! Use the copy buttons to copy individual sections.
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500 space-y-3">
                <div className="text-4xl">📝</div>
                <p className="text-sm text-center">Your amazing content will appear here once generated</p>
                <p className="text-xs text-center text-gray-400">Fill out the form and hit generate to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <LimitExceededModal 
        isOpen={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        type="tools"
      />
    </div>
  );
};

export default ToolForm;
