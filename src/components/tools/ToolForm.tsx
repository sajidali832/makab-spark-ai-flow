
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
      required?: boolean;
      placeholder?: string;
    }[];
  };
  onBack: () => void;
}

interface FormData {
  [key: string]: string;
}

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

  const validateForm = () => {
    const requiredFields = tool.fields.filter(field => field.required);
    for (const field of requiredFields) {
      if (!formData[field.name] || formData[field.name].trim() === '') {
        toast({
          title: "Missing Required Field",
          description: `Please fill in the ${field.label} field.`,
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
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
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-6xl">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-white/60 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back</span>
          </Button>
          
          <div className="text-xs sm:text-sm text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1 sm:py-2 border border-gray-200">
            {remainingGenerations}/3 left
          </div>
        </div>

        {/* Tool Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 sm:p-3 rounded-xl ${tool.color} shadow-lg`}>
            <tool.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{tool.name}</h1>
            <p className="text-sm sm:text-base text-gray-600">{tool.description}</p>
          </div>
        </div>

        {/* Mobile-First Layout */}
        <div className="space-y-6">
          {/* Input Form */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Wand2 className="h-5 w-5" />
                <span>Create {tool.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {tool.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="text-sm font-medium">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    
                    {field.type === 'text' && (
                      <Input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        className="w-full"
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'textarea' && (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        className="w-full min-h-[80px]"
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'select' && field.options && (
                      <Select 
                        onValueChange={(value) => handleSelectChange(field.name, value)}
                        required={field.required}
                      >
                        <SelectTrigger className="w-full">
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
                      <span>Generate Content</span>
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
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg p-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Sparkles className="h-5 w-5" />
                <span>Generated Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {result ? (
                <div className="space-y-4">
                  <Textarea
                    value={result}
                    readOnly
                    className="bg-gray-50 border-gray-300 focus:ring-green-500 focus:border-green-500 text-sm min-h-[200px] w-full"
                  />
                  <Button
                    onClick={handleCopy}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No content generated yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Fill out the form and click generate to see results here.</p>
                </div>
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
