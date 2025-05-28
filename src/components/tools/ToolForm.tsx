
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Wand2, Sparkles, Star, Copy, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ToolFormProps {
  toolId: string;
  onBack: () => void;
}

const ToolForm = ({ toolId, onBack }: ToolFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const { toast } = useToast();

  const toolConfigs = {
    caption: {
      title: 'Caption Generator',
      icon: '✨',
      fields: [
        { name: 'topic', label: 'Topic/Content', type: 'input', placeholder: 'What is your post about?' },
        { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Funny', 'Inspiring', 'Educational'] },
        { name: 'emotion', label: 'Emotion', type: 'select', options: ['Excited', 'Calm', 'Motivational', 'Humorous', 'Informative'] },
        { name: 'audience', label: 'Target Audience', type: 'input', placeholder: 'Who are you targeting?' }
      ]
    },
    script: {
      title: 'Script Generator',
      icon: '🎬',
      fields: [
        { name: 'topic', label: 'Video Topic', type: 'input', placeholder: 'What is your video about?' },
        { name: 'platform', label: 'Platform', type: 'select', options: ['YouTube', 'TikTok', 'Instagram Reels', 'Facebook'] },
        { name: 'length', label: 'Video Length', type: 'select', options: ['30 seconds', '1 minute', '3 minutes', '5 minutes', '10+ minutes'] },
        { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Educational', 'Entertainment'] },
        { name: 'audience', label: 'Target Audience', type: 'input', placeholder: 'Describe your audience' }
      ]
    },
    hashtag: {
      title: 'Hashtag Generator',
      icon: '#️⃣',
      fields: [
        { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'TikTok', 'Twitter', 'LinkedIn'] },
        { name: 'niche', label: 'Niche/Industry', type: 'input', placeholder: 'e.g., fitness, food, tech' },
        { name: 'keywords', label: 'Keywords', type: 'input', placeholder: 'Main keywords for your content' },
        { name: 'audience', label: 'Target Audience', type: 'input', placeholder: 'Who do you want to reach?' }
      ]
    },
    idea: {
      title: 'Idea Generator',
      icon: '💡',
      fields: [
        { name: 'type', label: 'Idea Type', type: 'select', options: ['Business', 'Content', 'Product', 'Service', 'Campaign'] },
        { name: 'industry', label: 'Industry', type: 'input', placeholder: 'Which industry or niche?' },
        { name: 'goal', label: 'Goal/Objective', type: 'input', placeholder: 'What do you want to achieve?' }
      ]
    },
    youtube: {
      title: 'YouTube Channel Ideas',
      icon: '🎥',
      fields: [
        { name: 'category', label: 'Category', type: 'select', options: ['Education', 'Entertainment', 'Gaming', 'Lifestyle', 'Tech', 'Business'] },
        { name: 'skill', label: 'Skill Level', type: 'select', options: ['Beginner', 'Intermediate', 'Expert'] },
        { name: 'audience', label: 'Target Audience', type: 'input', placeholder: 'Who will watch your channel?' },
        { name: 'content', label: 'Content Type', type: 'select', options: ['Tutorials', 'Reviews', 'Vlogs', 'Commentary', 'How-to'] }
      ]
    },
    bio: {
      title: 'Bio Generator',
      icon: '👤',
      fields: [
        { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'Twitter', 'LinkedIn', 'TikTok'] },
        { name: 'profession', label: 'Profession/Role', type: 'input', placeholder: 'What do you do?' },
        { name: 'vibe', label: 'Style/Vibe', type: 'select', options: ['Professional', 'Creative', 'Fun', 'Minimalist', 'Bold'] },
        { name: 'hobbies', label: 'Interests/Hobbies', type: 'input', placeholder: 'What are you passionate about?' }
      ]
    }
  };

  const config = toolConfigs[toolId as keyof typeof toolConfigs];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('tools-generation', {
        body: { toolType: toolId, formData }
      });

      if (error) {
        throw error;
      }

      setGeneratedContent(data.generatedContent);
      
      toast({
        title: "Content Generated! ✨",
        description: "Your AI-powered content is ready!",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Please try again. Make sure all fields are filled.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent) return;

    try {
      // Save to history
      const historyItem = {
        id: Date.now().toString(),
        type: toolId,
        content: generatedContent,
        timestamp: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('makab_history') || '[]');
      existing.push(historyItem);
      localStorage.setItem('makab_history', JSON.stringify(existing));

      // Also save to Supabase if user is authenticated
      const user = JSON.parse(localStorage.getItem('makab_user') || '{}');
      if (user.id) {
        await supabase.from('tool_generations').insert({
          user_id: user.id,
          tool_type: toolId,
          input_data: formData,
          generated_content: generatedContent
        });
      }

      toast({
        title: "Saved! 💾",
        description: "Content saved to your history",
      });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied! 📋",
      description: "Content copied to clipboard",
    });
  };

  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-600 animate-spin animate-reverse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Star className="w-8 h-8 text-purple-600 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">Generating your content...</p>
        <p className="text-sm text-gray-600">AI is working its magic ✨</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{config.icon}</span>
          <h2 className="text-2xl font-bold text-gray-800">{config.title}</h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wand2 className="h-5 w-5" />
              <span>Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === 'input' ? (
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  />
                ) : field.type === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  />
                ) : (
                  <Select value={formData[field.name] || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, [field.name]: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !Object.values(formData).some(v => v)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Generated Content</span>
              </div>
              {generatedContent && (
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <LoadingAnimation />
            ) : generatedContent ? (
              <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                  {generatedContent}
                </pre>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Your generated content will appear here</p>
                <p className="text-sm">Fill out the form and click generate to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ToolForm;
