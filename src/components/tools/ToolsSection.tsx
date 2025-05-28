
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  FileText, 
  Hash, 
  Lightbulb, 
  Youtube, 
  Instagram, 
  User,
  ArrowRight
} from 'lucide-react';
import ToolForm from './ToolForm';

interface Tool {
  id: string;
  name: string;
  icon: any;
  available: boolean;
}

const ToolsSection = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools: Tool[] = [
    { id: 'caption', name: 'Caption Generator', icon: MessageSquare, available: true },
    { id: 'script', name: 'Script Generator', icon: FileText, available: true },
    { id: 'hashtag', name: 'Hashtag Generator', icon: Hash, available: true },
    { id: 'idea', name: 'Idea Generator', icon: Lightbulb, available: true },
    { id: 'youtube', name: 'YouTube Channel Ideas', icon: Youtube, available: true },
    { id: 'instagram', name: 'Instagram Post Generator', icon: Instagram, available: false },
    { id: 'bio', name: 'Bio Generator', icon: User, available: true },
  ];

  if (selectedTool) {
    return (
      <ToolForm 
        toolId={selectedTool} 
        onBack={() => setSelectedTool(null)} 
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">AI Tools</h2>
      <p className="text-gray-600">Choose a tool to generate content for your needs</p>
      
      <div className="space-y-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-between h-auto p-0"
                  onClick={() => tool.available && setSelectedTool(tool.id)}
                  disabled={!tool.available}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tool.available 
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className={`font-medium ${tool.available ? 'text-gray-800' : 'text-gray-400'}`}>
                        {tool.name}
                      </p>
                      {!tool.available && (
                        <p className="text-xs text-gray-400">Coming soon</p>
                      )}
                    </div>
                  </div>
                  {tool.available && (
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ToolsSection;
