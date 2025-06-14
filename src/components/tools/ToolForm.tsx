
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
        {/* Compact Header */}
        <div className="flex items-center justify-between py-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="h-10 w-10 p-0 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1 mx-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {tool.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{tool.description}</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Responsive Layout */}
        <div className="space-y-6">
          {/* Form Section */}
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">Create Content</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {tool.inputs.map((input) => (
                <div key={input.name} className={`space-y-2 ${input.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                  <Label htmlFor={input.name} className="text-xs sm:text-sm font-medium text-gray-700">
                    {input.label}
                  </Label>
                  {input.type === 'text' && (
                    <Input
                      id={input.name}
                      placeholder={input.placeholder}
                      value={formData[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      className="w-full border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-10 sm:h-12 text-sm"
                    />
                  )}
                  {input.type === 'textarea' && (
                    <Textarea
                      id={input.name}
                      placeholder={input.placeholder}
                      value={formData[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      className="w-full min-h-[100px] sm:min-h-[120px] border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl text-sm"
                    />
                  )}
                  {input.type === 'select' && (
                    <Select
                      value={formData[input.name] || ''}
                      onValueChange={(value) => handleInputChange(input.name, value)}
                    >
                      <SelectTrigger className="border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-10 sm:h-12 text-sm">
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
              className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl h-12 sm:h-14 text-sm sm:text-lg font-semibold shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Generate Content</span>
                </div>
              )}
            </Button>
          </div>

          {/* Generated Content Section */}
          {generatedContent && (
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Generated Content</h3>
              </div>
              {renderGeneratedContent()}
            </div>
          )}

          {/* Placeholder when no content */}
          {!generatedContent && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
                </div>
                <p className="text-gray-500 text-base sm:text-lg">Your generated content will appear here</p>
                <p className="text-gray-400 text-xs sm:text-sm">Fill out the form and click generate to get started</p>
              </div>
            </div>
          )}
        </div>

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
