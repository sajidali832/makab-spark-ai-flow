import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Sparkles, Wand2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LimitExceededModal from '../LimitExceededModal';
import { useDailyLimits } from '@/hooks/useDailyLimits';

interface ToolFormProps {
  tool: {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    fields: {
      name: string;
      label: string;
      type: string;
      options?: string[];
    }[];
  };
  onBack: () => void;
}

interface FormData {
  [key: string]: string;
}

const toolConfigurations = {
  caption: {
    fields: [
      { name: 'topic', label: 'Topic', type: 'text' },
      { name: 'audience', label: 'Target Audience', type: 'text' },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Friendly', 'Professional', 'Humorous', 'Exciting'] },
      { name: 'emotion', label: 'Emotion', type: 'select', options: ['Happy', 'Sad', 'Angry', 'Surprised'] }
    ]
  },
  script: {
    fields: [
      { name: 'topic', label: 'Topic', type: 'text' },
      { name: 'platform', label: 'Platform', type: 'select', options: ['YouTube', 'TikTok', 'Instagram Reels'] },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Informative', 'Entertaining', 'Educational'] },
      { name: 'audience', label: 'Target Audience', type: 'text' },
      { name: 'length', label: 'Length', type: 'select', options: ['Short', 'Medium', 'Long'] }
    ]
  },
  hashtag: {
    fields: [
      { name: 'niche', label: 'Niche', type: 'text' },
      { name: 'keywords', label: 'Keywords', type: 'text' },
      { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'Twitter', 'TikTok'] },
      { name: 'audience', label: 'Target Audience', type: 'text' }
    ]
  },
  idea: {
    fields: [
      { name: 'industry', label: 'Industry', type: 'text' },
      { name: 'goal', label: 'Goal', type: 'text' },
      { name: 'type', label: 'Type', type: 'select', options: ['Business', 'Marketing', 'Product', 'Content'] }
    ]
  },
  youtube: {
    fields: [
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'skill', label: 'Skill Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
      { name: 'audience', label: 'Target Audience', type: 'text' },
      { name: 'content', label: 'Content Type', type: 'select', options: ['Tutorials', 'Reviews', 'Vlogs'] }
    ]
  },
  bio: {
    fields: [
      { name: 'profession', label: 'Profession', type: 'text' },
      { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'Twitter', 'LinkedIn'] },
      { name: 'vibe', label: 'Style', type: 'select', options: ['Professional', 'Creative', 'Minimalist'] },
      { name: 'hobbies', label: 'Interests', type: 'text' }
    ]
  }
};

const ToolForm = ({ tool, onBack }: ToolFormProps) => {
  const [formData, setFormData] = useState<FormData>({});
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const { canUseTools, incrementToolGenerations, remainingGenerations } = useDailyLimits();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check daily limit
    if (!canUseTools()) {
      setLimitModalOpen(true);
      return;
    }

    // Increment the usage count
    if (!incrementToolGenerations()) {
      setLimitModalOpen(true);
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await supabase.functions.invoke('tools-generation', {
        body: {
          toolType: tool.id,
          formData: formData
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setResult(response.data.generatedContent);
      toast({
        title: "Generated! ✨",
        description: "Content generated successfully.",
      });
    } catch (error: any) {
      console.error('Error generating content:', error);
      toast({
        title: "Error ❌",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-white/60"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Button>
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-xl ${tool.color} shadow-lg`}>
                <tool.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{tool.name}</h1>
                <p className="text-gray-600">{tool.description}</p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
            {remainingGenerations}/3 generations left
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5" />
                <span>Create {tool.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {toolConfigurations[tool.id as keyof typeof toolConfigurations].fields.map((field) => (
                  <div key={field.name}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === 'text' && (
                      <Input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    )}
                    {field.type === 'textarea' && (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    )}
                    {field.type === 'select' && field.options && (
                      <Select onValueChange={(value) => handleSelectChange(field.name, value)}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
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
                  type="submit"
                  disabled={isLoading || !canUseTools()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : !canUseTools() ? (
                    "Daily Limit Reached"
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Generate {tool.name}</span>
                    </div>
                  )}
                </Button>
                
                {!canUseTools() && (
                  <p className="text-center text-sm text-red-500">
                    Daily limit reached. Resets at midnight.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Result Display */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Generated Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {result ? (
                <>
                  <Textarea
                    value={result}
                    readOnly
                    className="bg-gray-50 border-gray-300 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                  <Button
                    onClick={handleCopy}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </>
              ) : (
                <p className="text-gray-500">No content generated yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Limit Exceeded Modal */}
      <LimitExceededModal 
        isOpen={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        type="tools"
      />
    </div>
  );
};

export default ToolForm;
