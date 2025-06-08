import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Sparkles, Zap, Stars, RefreshCw, Save, Hash } from 'lucide-react';
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
      description: 'Create engaging social media captions that drive interaction',
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
      description: 'Generate trending hashtags that boost your content visibility',
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
    if (!canUseTools()) {
      setLimitModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      if (!incrementToolGenerations()) {
        setLimitModalOpen(true);
        return;
      }

      const { data, error } = await supabase.functions.invoke('tools-generation', {
        body: {
          toolType,
          inputData: formData
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate content');
      }

      if (!data || !data.generatedContent) {
        throw new Error('No content received from the server');
      }

      setGeneratedContent(data.generatedContent);
      
      toast({
        title: "✨ Content Created Successfully!",
        description: "Your professional content is ready to use",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Something went wrong. Please try again.",
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
        title: "✅ Copied Successfully!",
        description: "Content is now in your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy content to clipboard",
        variant: "destructive",
      });
    }
  };

  const copyAllHashtags = () => {
    if (toolType === 'hashtag' && generatedContent) {
      const hashtags = generatedContent.match(/#\w+/g)?.join(' ') || generatedContent;
      copyToClipboard(hashtags, 'hashtags');
    }
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
      const lines = content.split('\n').filter(line => line.trim());
      let currentSection = '';
      let currentContent = '';
      
      for (const line of lines) {
        if (line.includes('Caption') || line.includes('CAPTION') || line.includes('Version')) {
          if (currentContent) {
            sections.push({
              title: currentSection || 'Caption',
              content: currentContent.trim(),
              type: 'caption'
            });
          }
          currentSection = line.replace(/[#*\-]/g, '').trim();
          currentContent = '';
        } else if (line.includes('Hashtag') || line.includes('HASHTAG') || line.includes('#')) {
          if (currentContent) {
            sections.push({
              title: currentSection || 'Caption',
              content: currentContent.trim(),
              type: 'caption'
            });
          }
          sections.push({
            title: 'Hashtags',
            content: line.replace(/Hashtags?:?/i, '').trim(),
            type: 'hashtags'
          });
          currentSection = '';
          currentContent = '';
        } else {
          currentContent += line + '\n';
        }
      }
      
      if (currentContent) {
        sections.push({
          title: currentSection || 'Caption',
          content: currentContent.trim(),
          type: 'caption'
        });
      }
    } else if (toolType === 'hashtag') {
      sections.push({
        title: 'Generated Hashtags',
        content: content,
        type: 'hashtags'
      });
    } else if (toolType === 'engagement-questions') {
      const questionBlocks = content.split(/\n\s*\n/).filter(block => block.trim());
      questionBlocks.forEach((block, index) => {
        if (block.trim()) {
          sections.push({
            title: `Question ${index + 1}`,
            content: block.trim(),
            type: 'question'
          });
        }
      });
    } else if (toolType === 'idea') {
      const ideaBlocks = content.split(/\n\s*\n/).filter(block => block.trim());
      ideaBlocks.forEach((block, index) => {
        if (block.trim()) {
          sections.push({
            title: `Idea ${index + 1}`,
            content: block.trim(),
            type: 'idea'
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
    <div className="max-w-7xl mx-auto space-y-4 p-3 sm:p-4">
      {/* Enhanced Professional Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 mb-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 animate-bounce"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <Button onClick={onBack} variant="secondary" size="sm" className="shrink-0 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
              ← Back
            </Button>
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg animate-pulse">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 animate-fade-in">{currentTool.title}</h2>
            <p className="text-xl text-white/90 mb-6 leading-relaxed">{currentTool.description}</p>
            <div className="flex items-center space-x-3 text-sm bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-flex">
              <Stars className="h-5 w-5 animate-spin" />
              <span className="font-medium">Powered by Makab O1 AI</span>
              <Zap className="h-5 w-5 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="order-2 lg:order-1 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span>Input Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {currentTool.fields.map((field: any) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-semibold text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === 'text' && (
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                  />
                )}
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full min-h-[80px] border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                  />
                )}
                {field.type === 'select' && (
                  <Select
                    value={formData[field.name] || ''}
                    onValueChange={(value) => handleInputChange(field.name, value)}
                  >
                    <SelectTrigger className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300">
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
            
            {/* Daily Usage */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5 shadow-inner">
              <div className="flex items-center justify-center space-x-2 text-blue-600 mb-3">
                <Stars className="h-5 w-5 animate-pulse" />
                <span className="font-bold">Daily Usage</span>
              </div>
              <p className="text-center text-blue-600 font-semibold text-lg">
                {remainingGenerations} generations remaining today
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-6 text-xl font-bold transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-purple-500/25 border-0"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span>Creating Magic...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Zap className="h-6 w-6" />
                  <span>Generate Professional Content</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card className="order-1 lg:order-2 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span>Professional Content</span>
              </CardTitle>
              {generatedContent && (
                <div className="flex space-x-2">
                  {toolType === 'hashtag' && (
                    <Button
                      onClick={copyAllHashtags}
                      variant="outline"
                      size="sm"
                      className="p-2 transition-all duration-200 hover:scale-110 border-purple-200 hover:border-purple-400"
                      title="Copy All Hashtags"
                    >
                      <Hash className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={handleGenerate}
                    variant="outline"
                    size="sm"
                    className="p-2 transition-all duration-200 hover:scale-110 border-blue-200 hover:border-blue-400"
                    disabled={isGenerating}
                    title="Regenerate"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(generatedContent)}
                    variant="outline"
                    size="sm"
                    className="p-2 transition-all duration-200 hover:scale-110 border-green-200 hover:border-green-400"
                    title="Copy All"
                  >
                    {copied.all ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    onClick={saveContent}
                    variant="outline"
                    size="sm"
                    className="p-2 transition-all duration-200 hover:scale-110 border-gray-200 hover:border-gray-400"
                    title="Save"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-80 space-y-8">
                {/* Premium Loading Animation */}
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full h-24 w-24 border-4 border-blue-400 opacity-20"></div>
                  <div className="absolute inset-2 animate-pulse rounded-full h-20 w-20 border-4 border-purple-400 opacity-30"></div>
                  <div className="absolute inset-4 animate-bounce rounded-full h-16 w-16 border-4 border-pink-400 opacity-40"></div>
                  <div className="relative animate-spin rounded-full h-24 w-24 border-4 border-t-blue-600 border-r-purple-600 border-b-pink-600 border-l-indigo-600"></div>
                  <div className="absolute inset-8 animate-pulse">
                    <Sparkles className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                {/* Enhanced Loading Text */}
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-gray-800 animate-pulse bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ✨ Crafting Your Professional Content ✨
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Makab O1 AI is working its magic...
                  </p>
                  
                  {/* Professional Progress Animation */}
                  <div className="flex justify-center space-x-3 mt-8">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce shadow-lg"></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
                
                {/* Premium Progress Bar */}
                <div className="w-full max-w-md">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
                  </div>
                </div>
              </div>
            ) : generatedContent ? (
              <div className="space-y-5 animate-fade-in">
                {parseGeneratedContent(generatedContent).map((section, index) => (
                  <div key={index} className="border-2 border-gray-100 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 px-6 py-4 border-b-2 border-gray-100 flex items-center justify-between">
                      <h4 className="font-bold text-gray-800 flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                        <span className="text-lg">{section.title}</span>
                      </h4>
                      <Button
                        onClick={() => copyToClipboard(section.content, `section-${index}`)}
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 hover:bg-blue-100 transition-all duration-200 hover:scale-110 rounded-xl"
                        title="Copy this section"
                      >
                        {copied[`section-${index}`] ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-600" />
                        )}
                      </Button>
                    </div>
                    <div className="p-6 bg-white">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-medium">
                        {section.content}
                      </pre>
                    </div>
                  </div>
                ))}
                <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-center space-x-3 text-green-600 mb-2">
                    <Check className="h-6 w-6" />
                    <span className="font-bold text-lg">Professional Content Created!</span>
                  </div>
                  <p className="text-sm text-gray-600">Use the copy buttons to copy individual sections or copy all at once</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-6">
                <div className="text-6xl animate-bounce">✨</div>
                <div className="text-center space-y-3">
                  <p className="text-xl font-semibold">Ready to Create Professional Content?</p>
                  <p className="text-sm text-gray-400">Fill out the form and hit generate to get started with Makab O1!</p>
                </div>
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
