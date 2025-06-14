import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, ArrowLeft, Sparkles, Loader2, RefreshCw, Save, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDailyLimits } from '@/hooks/useDailyLimits';
import LimitExceededModal from '../LimitExceededModal';
import CodeBlock from './CodeBlock';
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
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();
  const { canUseTools, incrementToolGenerations } = useDailyLimits();

  // Load saved items on component mount
  useEffect(() => {
    const saved = localStorage.getItem(`saved-${tool.id}`);
    if (saved) {
      try {
        setSavedItems(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load saved items:', err);
      }
    }
  }, [tool.id]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const saveToHistory = async (content: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('makab_user') || '{}');
      if (user.id) {
        // Save to Supabase
        const { error } = await supabase.from('tool_history').insert({
          user_id: user.id,
          tool_id: tool.id,
          tool_name: tool.title,
          inputs: formData,
          output: content,
          created_at: new Date().toISOString()
        });

        if (error) {
          console.error('Failed to save to database:', error);
          // Fallback to local storage
          const savedList = [...savedItems, content];
          setSavedItems(savedList);
          localStorage.setItem(`saved-${tool.id}`, JSON.stringify(savedList));
        }
      } else {
        // Save to local storage if no user
        const savedList = [...savedItems, content];
        setSavedItems(savedList);
        localStorage.setItem(`saved-${tool.id}`, JSON.stringify(savedList));
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      
      toast({
        title: "Saved!",
        description: "Content saved to history",
      });
    } catch (err) {
      console.error('Failed to save:', err);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    }
  };

  const saveContent = async () => {
    if (!generatedContent) return;
    await saveToHistory(generatedContent);
  };

  const generateContent = async (isRegeneration = false) => {
    if (!canUseTools()) {
      setLimitModalOpen(true);
      return;
    }

    if (!incrementToolGenerations()) {
      setLimitModalOpen(true);
      return;
    }

    if (isRegeneration) {
      setIsRegenerating(true);
    } else {
      setIsLoading(true);
    }

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
      setIsRegenerating(false);
    }
  };

  const regenerateContent = () => {
    generateContent(true);
  };

  const isCodeContent = (content: string) => {
    // Check if content contains code patterns
    const codePatterns = [
      /```[\s\S]*```/,  // Markdown code blocks
      /function\s+\w+\s*\(/,  // Function declarations
      /const\s+\w+\s*=/,  // Const declarations
      /let\s+\w+\s*=/,  // Let declarations
      /var\s+\w+\s*=/,  // Var declarations
      /class\s+\w+/,  // Class declarations
      /import\s+.*from/,  // Import statements
      /export\s+(default\s+)?/,  // Export statements
      /<\w+.*>/,  // HTML/JSX tags
      /\{[\s\S]*\}/,  // Code blocks with braces
      /if\s*\(/,  // If statements
      /for\s*\(/,  // For loops
      /while\s*\(/,  // While loops
    ];
    
    return codePatterns.some(pattern => pattern.test(content));
  };

  const renderActionButtons = (textToCopy?: string) => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => copyToClipboard(textToCopy || generatedContent)}
        className={`h-10 w-10 p-0 transition-all duration-200 ${
          copySuccess ? 'bg-green-50 border-green-200 scale-110' : 'hover:scale-105'
        }`}
        title="Copy"
      >
        {copySuccess ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="outline"
        onClick={regenerateContent}
        disabled={isLoading || isRegenerating}
        className="h-10 w-10 p-0 hover:scale-105 transition-all duration-200"
        title="Regenerate"
      >
        <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
      </Button>
      <Button
        variant="outline"
        onClick={saveContent}
        className={`h-10 w-10 p-0 transition-all duration-200 ${
          saveSuccess ? 'bg-green-50 border-green-200 scale-110' : 'hover:scale-105'
        }`}
        title="Save"
      >
        {saveSuccess ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Save className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  const renderGeneratedContent = () => {
    if (!generatedContent) return null;

    // If content looks like code, render it in a code block
    if (isCodeContent(generatedContent)) {
      return (
        <div className="space-y-4 w-full">
          <div className="w-full overflow-hidden">
            <CodeBlock code={generatedContent} language="javascript" />
          </div>
          {renderActionButtons()}
        </div>
      );
    }

    // For hashtags - special formatting
    if (tool.id === 'hashtag-generator' || tool.id === 'hashtag') {
      const hashtags = generatedContent.split('\n').filter(line => line.trim().startsWith('#'));
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {hashtags.map((hashtag, index) => (
              <div key={index} className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-3 py-2 group hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
                <span className="text-blue-700 text-sm font-medium">{hashtag}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(hashtag)}
                  className="ml-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  title="Copy"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          {renderActionButtons(hashtags.join(' '))}
        </div>
      );
    }

    // For captions - special formatting
    if (tool.id === 'caption-generator' || tool.id === 'caption') {
      const captions = generatedContent.split('\n\n').filter(caption => caption.trim());
      return (
        <div className="space-y-4">
          {captions.map((caption, index) => (
            <div key={index} className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-4 group relative hover:from-gray-100 hover:to-slate-100 transition-all duration-200">
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap pr-8">{caption}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(caption)}
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                title="Copy"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {renderActionButtons()}
        </div>
      );
    }

    // Default content display for other tools
    return (
      <div className="space-y-4 w-full">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-4 relative group hover:from-gray-100 hover:to-slate-100 transition-all duration-200 w-full overflow-hidden">
          <pre className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words pr-8 max-w-full overflow-x-auto">{generatedContent}</pre>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(generatedContent)}
            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            title="Copy"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        {renderActionButtons()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Compact Header */}
        <div className="flex items-center justify-between py-4">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="h-10 w-10 p-0 rounded-full hover:bg-white/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1 mx-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {tool.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{tool.description}</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Form Section */}
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Create Content</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    className="w-full border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-10 sm:h-11 text-sm"
                  />
                )}
                {input.type === 'textarea' && (
                  <Textarea
                    id={input.name}
                    placeholder={input.placeholder}
                    value={formData[input.name] || ''}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                    className="w-full min-h-[80px] sm:min-h-[100px] border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl text-sm resize-none"
                  />
                )}
                {input.type === 'select' && (
                  <Select
                    value={formData[input.name] || ''}
                    onValueChange={(value) => handleInputChange(input.name, value)}
                  >
                    <SelectTrigger className="border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-10 sm:h-11 text-sm">
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
            onClick={() => generateContent(false)}
            disabled={isLoading || isRegenerating || !canUseTools()}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
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
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 sm:p-6 shadow-xl w-full overflow-hidden">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Copy className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Generated Content</h3>
              {isRegenerating && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Regenerating...</span>
                </div>
              )}
            </div>
            <div className="w-full overflow-hidden">
              {renderGeneratedContent()}
            </div>
          </div>
        )}

        {/* Placeholder when no content */}
        {!generatedContent && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/40 rounded-2xl p-6 sm:p-8 shadow-lg flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
              </div>
              <p className="text-gray-500 text-base sm:text-lg">Your generated content will appear here</p>
              <p className="text-gray-400 text-xs sm:text-sm">Fill out the form and click generate to get started</p>
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
