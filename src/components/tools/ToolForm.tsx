import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, Check } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const { toast } = useToast();
  const { canUseTools, incrementToolGenerations } = useDailyLimits();

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
    if (!canUseTools()) {
      setLimitModalOpen(true);
      return;
    }

    if (!incrementToolGenerations()) {
      setLimitModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const user = JSON.parse(localStorage.getItem('makab_user') || '{}');
      
      const { data, error } = await supabase.functions.invoke('tools-generation', {
        body: {
          toolType,
          inputData: formData,
          userId: user.id
        }
      });

      if (error) throw error;

      setGeneratedContent(data.generatedContent);
      
      toast({
        title: "Success!",
        description: "Content generated successfully",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
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
  };

  const canGenerate = currentTool.fields
    .filter((field: any) => field.required)
    .every((field: any) => formData[field.name]?.trim());

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 p-2 sm:p-4">
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
              disabled={!canGenerate || isGenerating || !canUseTools()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base"
            >
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </Button>

            {!canUseTools() && (
              <p className="text-center text-xs sm:text-sm text-red-500 mt-2">
                Daily tool limit reached. Resets at midnight.
              </p>
            )}
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
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center text-xs sm:text-sm"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    )}
                    {copied ? 'Copied!' : 'Copy All'}
                  </Button>
                  <Button
                    onClick={downloadAsFile}
                    variant="outline"
                    size="sm"
                    className="flex items-center text-xs sm:text-sm"
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
              <div className="flex flex-col items-center justify-center h-32 space-y-3">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-blue-400 opacity-20"></div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 animate-pulse">Generating amazing content...</p>
                  <div className="flex justify-center space-x-1 mt-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            ) : generatedContent ? (
              <div className="space-y-3 sm:space-y-4 animate-fade-in">
                <div className="max-h-80 sm:max-h-96 overflow-y-auto p-3 sm:p-4 bg-gray-50 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-800 font-mono">
                    {generatedContent}
                  </pre>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Click "Copy All" to copy the complete content, or "Download" to save as a file
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <p className="text-sm">Generated content will appear here</p>
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
