
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Save, RotateCcw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ToolFormProps {
  toolId: string;
  onBack: () => void;
}

const ToolForm = ({ toolId, onBack }: ToolFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const toolConfigs = {
    caption: {
      title: 'Caption Generator',
      fields: [
        { name: 'topic', label: 'Product/Service/Topic', type: 'input', required: true },
        { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Funny', 'Inspiring', 'Educational'], required: true },
        { name: 'emotion', label: 'Emotion', type: 'select', options: ['Excited', 'Calm', 'Motivational', 'Friendly', 'Authoritative'], required: true },
        { name: 'audience', label: 'Target Audience', type: 'input', required: true },
      ]
    },
    script: {
      title: 'Script Generator',
      fields: [
        { name: 'platform', label: 'Platform', type: 'select', options: ['YouTube', 'TikTok', 'Instagram', 'Podcast', 'Presentation'], required: true },
        { name: 'length', label: 'Video Length (minutes)', type: 'select', options: ['3', '5', '7', '10', '15', '30', '60'], required: true },
        { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Educational', 'Entertaining'], required: true },
        { name: 'audience', label: 'Target Audience', type: 'input', required: true },
        { name: 'topic', label: 'Topic/Subject', type: 'textarea', required: true },
      ]
    },
    hashtag: {
      title: 'Hashtag Generator',
      fields: [
        { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube'], required: true },
        { name: 'niche', label: 'Niche/Industry', type: 'input', required: true },
        { name: 'keywords', label: 'Target Keywords', type: 'input', required: true },
        { name: 'audience', label: 'Target Audience', type: 'input', required: false },
      ]
    },
    idea: {
      title: 'Idea Generator',
      fields: [
        { name: 'type', label: 'Idea Type', type: 'select', options: ['Business', 'Content', 'Personal Project', 'Product', 'Service'], required: true },
        { name: 'industry', label: 'Industry/Niche', type: 'input', required: true },
        { name: 'goal', label: 'Goal/Objective', type: 'textarea', required: true },
      ]
    },
    youtube: {
      title: 'YouTube Channel Ideas',
      fields: [
        { name: 'category', label: 'Category', type: 'select', options: ['Tech', 'Lifestyle', 'Education', 'Entertainment', 'Gaming', 'Business', 'Health'], required: true },
        { name: 'skill', label: 'Skill Level', type: 'select', options: ['Beginner', 'Intermediate', 'Expert'], required: true },
        { name: 'audience', label: 'Target Audience', type: 'input', required: true },
        { name: 'content', label: 'Content Type', type: 'select', options: ['Tutorials', 'Reviews', 'Vlogs', 'Educational', 'Entertainment'], required: true },
      ]
    },
    bio: {
      title: 'Bio Generator',
      fields: [
        { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Personal Website'], required: true },
        { name: 'profession', label: 'Profession/Role', type: 'input', required: true },
        { name: 'vibe', label: 'Vibe/Style', type: 'select', options: ['Professional', 'Creative', 'Funny', 'Minimalist', 'Inspirational'], required: true },
        { name: 'hobbies', label: 'Interests/Hobbies', type: 'input', required: false },
      ]
    },
  };

  const config = toolConfigs[toolId as keyof typeof toolConfigs];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    const sampleResults = {
      caption: "🌟 Discover the power of innovation! ✨\n\nOur latest product is designed to transform your daily routine and boost your productivity. Join thousands of satisfied customers who've already made the switch!\n\n💡 Key benefits:\n• Time-saving features\n• User-friendly design\n• Proven results\n\n#Innovation #Productivity #LifeHack #TechLife #GameChanger",
      script: "Hey everyone! Welcome back to my channel.\n\n[HOOK - 0:00-0:15]\nToday I'm going to show you something that will completely change how you think about [topic]. If you've ever struggled with [problem], this video is for you.\n\n[INTRODUCTION - 0:15-0:30]\nBefore we dive in, make sure to hit that subscribe button and ring the notification bell so you never miss our latest content.\n\n[MAIN CONTENT - 0:30-4:30]\nLet me break this down into three simple steps...\n\n[CONCLUSION - 4:30-5:00]\nThat's a wrap! Let me know in the comments what you think, and I'll see you in the next video!",
      hashtag: "#innovation #tech #startup #entrepreneur #business #productivity #growth #success #motivation #inspiration #creative #design #digital #future #trending #viral #explore #discover #lifestyle #goals",
      idea: "💡 **Idea #1: Eco-Friendly Meal Prep Containers**\nCreate biodegradable, compartmentalized containers for meal prep enthusiasts who care about the environment.\n\n💡 **Idea #2: Virtual Reality Workspace Tours**\nDevelop VR experiences that let remote workers 'visit' inspiring workspaces around the world.\n\n💡 **Idea #3: AI-Powered Plant Care Assistant**\nA smart device that monitors plant health and provides personalized care recommendations.",
      youtube: "🎥 **Channel Ideas for You:**\n\n1. **Tech Simplified** - Breaking down complex technology for everyday users\n2. **Gadget Weekly** - Weekly reviews of the latest tech gadgets\n3. **Code & Coffee** - Programming tutorials with a cozy, approachable vibe\n4. **Future Tech Today** - Exploring emerging technologies and their impact\n5. **Tech on a Budget** - Finding affordable alternatives to expensive tech",
      bio: "🚀 Digital Innovator | Tech Enthusiast\n💡 Turning ideas into reality, one line of code at a time\n🌟 Sharing the journey of building amazing products\n📍 Building the future from [Your City]\n👇 Check out my latest project"
    };
    
    setResult(sampleResults[toolId as keyof typeof sampleResults] || 'Generated content will appear here...');
    setIsGenerating(false);
    
    toast({
      title: "Generated!",
      description: "Your content has been generated successfully.",
    });
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(result);
        toast({ title: "Copied!", description: "Content copied to clipboard" });
        break;
      case 'save':
        // Save to history (implement with Supabase)
        const saved = JSON.parse(localStorage.getItem('makab_history') || '[]');
        saved.push({
          id: Date.now().toString(),
          type: toolId,
          content: result,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('makab_history', JSON.stringify(saved));
        toast({ title: "Saved!", description: "Content saved to history" });
        break;
      case 'regenerate':
        handleGenerate();
        break;
      case 'delete':
        setResult('');
        toast({ title: "Deleted!", description: "Content cleared" });
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">{config.title}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label} {field.required && '*'}</Label>
              {field.type === 'input' && (
                <Input
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                />
              )}
              {field.type === 'textarea' && (
                <Textarea
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                  rows={3}
                />
              )}
              {field.type === 'select' && (
                <Select
                  value={formData[field.name] || ''}
                  onValueChange={(value) => setFormData({ ...formData, [field.name]: value })}
                >
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
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </div>
            ) : (
              'Generate Content'
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Content</span>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleAction('copy')}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleAction('save')}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleAction('regenerate')}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleAction('delete')}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{result}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ToolForm;
