
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDailyLimits } from '@/hooks/useDailyLimits';
import LimitExceededModal from '../LimitExceededModal';
import { supabase } from '@/integrations/supabase/client';

interface ToolFormProps {
  tool: {
    id: string;
    title: string;
    description: string;
    inputs: Array<{
      name: string;
      label: string;
      type: 'text' | 'textarea' | 'select';
      options?: string[];
      placeholder?: string;
    }>;
  };
}

const ToolForm = ({ tool }: ToolFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const { toast } = useToast();
  const { canUseTools, incrementToolGenerations } = useDailyLimits();

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateContent = async () => {
    if (!canUseTools()) {
      setLimitModalOpen(true);
      return;
    }

    if (!incrementToolGenerations()) {
      setLimitModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('tools-generation', {
        body: {
          toolId: tool.id,
          inputs: formData
        }
      });

      if (error) throw error;
      setGeneratedContent(data.content);
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderGeneratedContent = () => {
    if (!generatedContent) return null;

    // Parse different content types
    if (tool.id === 'hashtag-generator' || tool.id === 'hashtag') {
      const hashtags = generatedContent.split('\n').filter(line => line.trim().startsWith('#'));
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {hashtags.map((hashtag, index) => (
              <div key={index} className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 group hover:bg-blue-100 transition-colors">
                <span className="text-blue-700 text-sm font-medium">{hashtag}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(hashtag)}
                  className="ml-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => copyToClipboard(hashtags.join(' '))}
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All Hashtags
          </Button>
        </div>
      );
    }

    if (tool.id === 'caption-generator' || tool.id === 'caption') {
      const captions = generatedContent.split('\n\n').filter(caption => caption.trim());
      return (
        <div className="space-y-4">
          {captions.map((caption, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 group relative hover:bg-gray-100 transition-colors">
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{caption}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(caption)}
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => copyToClipboard(generatedContent)}
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All Captions
          </Button>
        </div>
      );
    }

    if (tool.id === 'script-generator') {
      const scripts = generatedContent.split('---').filter(script => script.trim());
      return (
        <div className="space-y-4">
          {scripts.map((script, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 group relative hover:bg-gray-100 transition-colors">
              <pre className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-mono">{script.trim()}</pre>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(script.trim())}
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => copyToClipboard(generatedContent)}
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All Scripts
          </Button>
        </div>
      );
    }

    // Default content display for other tools
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative group hover:bg-gray-100 transition-colors">
        <pre className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{generatedContent}</pre>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(generatedContent)}
          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Minimized Header */}
        <div className="text-center space-y-2 py-4">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="absolute left-4 top-4 h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-800">{tool.title}</h2>
          <p className="text-sm text-gray-600">{tool.description}</p>
        </div>

        {/* Form Section */}
        <div className="bg-white/90 border border-gray-200/60 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
          <div className="space-y-4">
            {tool.inputs.map((input) => (
              <div key={input.name} className="space-y-2">
                <Label htmlFor={input.name} className="text-sm font-medium text-gray-700">
                  {input.label}
                </Label>
                {input.type === 'text' && (
                  <Input
                    id={input.name}
                    placeholder={input.placeholder}
                    value={formData[input.name] || ''}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                    className="w-full border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  />
                )}
                {input.type === 'textarea' && (
                  <Textarea
                    id={input.name}
                    placeholder={input.placeholder}
                    value={formData[input.name] || ''}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                    className="w-full min-h-[100px] border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  />
                )}
                {input.type === 'select' && (
                  <Select
                    value={formData[input.name] || ''}
                    onValueChange={(value) => handleInputChange(input.name, value)}
                  >
                    <SelectTrigger className="border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
                      <SelectValue placeholder={input.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {input.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={generateContent}
            disabled={isLoading || !canUseTools()}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl h-12"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 text-yellow-500">
                  <svg className="animate-spin" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span>Generating...</span>
              </div>
            ) : (
              'Generate Content'
            )}
          </Button>
        </div>

        {/* Generated Content Section - At Bottom */}
        {generatedContent && (
          <div className="bg-white/90 border border-gray-200/60 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Generated Content</h3>
              </div>
              {renderGeneratedContent()}
            </div>
          </div>
        )}

        <LimitExceededModal
          isOpen={limitModalOpen}
          onClose={() => setLimitModalOpen(false)}
          type="tools"
        />
      </div>
    </div>
  );
};

export default ToolForm;
