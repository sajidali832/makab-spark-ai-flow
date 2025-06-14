
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Zap, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDailyLimits } from '@/hooks/useDailyLimits';
import LimitExceededModal from '../LimitExceededModal';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tool_type: string;
  template_data: any;
}

const QuickTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingTemplate, setGeneratingTemplate] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const { toast } = useToast();
  const { canUseTools, incrementToolGenerations } = useDailyLimits();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('content_templates')
        .select('*')
        .eq('is_active', true)
        .order('category');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFromTemplate = async (template: Template) => {
    if (!canUseTools()) {
      setLimitModalOpen(true);
      return;
    }

    if (!incrementToolGenerations()) {
      setLimitModalOpen(true);
      return;
    }

    setGeneratingTemplate(template.id);

    try {
      const { data, error } = await supabase.functions.invoke('tools-generation', {
        body: {
          toolId: template.tool_type,
          inputs: template.template_data
        }
      });

      if (error) throw error;
      setGeneratedContent(data.content);

      toast({
        title: "Generated!",
        description: `Content generated from ${template.name} template`,
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingTemplate(null);
    }
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
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  const categoryColors = {
    'Daily Posts': 'from-blue-100 to-cyan-100',
    'Promotions': 'from-green-100 to-emerald-100',
    'Engagement': 'from-purple-100 to-indigo-100',
    'Educational': 'from-orange-100 to-yellow-100',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="h-10 w-10 p-0 rounded-full hover:bg-white/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1 mx-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              Quick Templates
            </h1>
            <p className="text-sm text-gray-600 mt-1">Ready-to-use content templates</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Templates by Category */}
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category} className="space-y-4">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || 'from-gray-100 to-gray-200'} text-gray-800`}>
              {category}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTemplates.map((template) => (
                <Card key={template.id} className="bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-200 group">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                      </div>
                      <Button
                        onClick={() => generateFromTemplate(template)}
                        disabled={generatingTemplate === template.id}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {generatingTemplate === template.id ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Generating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4" />
                            <span>Generate</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Generated Content Display */}
        {generatedContent && (
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Generated Content</h3>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(generatedContent)}
                className="flex items-center space-x-2"
              >
                <span>Copy</span>
              </Button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <pre className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{generatedContent}</pre>
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

export default QuickTemplates;
