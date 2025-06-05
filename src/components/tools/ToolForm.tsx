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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button onClick={onBack} variant="outline" size="sm">
          ← Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{currentTool.title}</h2>
          <p className="text-gray-600">{currentTool.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Input Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentTool.fields.map((field: any) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === 'text' && (
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full"
                  />
                )}
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full min-h-[100px]"
                  />
                )}
                {field.type === 'select' && (
                  <Select
                    value={formData[field.name] || ''}
                    onValueChange={(value) => handleInputChange(field.name, value)}
                  >
                    <SelectTrigger className="w-full">
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
            
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating || !canUseTools()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </Button>

            {!canUseTools() && (
              <p className="text-center text-sm text-red-500 mt-2">
                Daily tool limit reached. Resets at midnight.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Content</CardTitle>
              {generatedContent && (
                <div className="flex space-x-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-1 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? 'Copied!' : 'Copy All'}
                  </Button>
                  <Button
                    onClick={downloadAsFile}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : generatedContent ? (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {generatedContent}
                  </pre>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Click "Copy All" to copy the complete content, or "Download" to save as a file
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <p>Generated content will appear here</p>
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
