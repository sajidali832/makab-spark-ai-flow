
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
  gradient: string;
}

const ToolsSection = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools: Tool[] = [
    { id: 'caption', name: 'Caption Generator', icon: MessageSquare, available: true, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'script', name: 'Script Generator', icon: FileText, available: true, gradient: 'from-purple-500 to-pink-500' },
    { id: 'hashtag', name: 'Hashtag Generator', icon: Hash, available: true, gradient: 'from-green-500 to-emerald-500' },
    { id: 'idea', name: 'Idea Generator', icon: Lightbulb, available: true, gradient: 'from-yellow-500 to-orange-500' },
    { id: 'youtube', name: 'YouTube Channel Ideas', icon: Youtube, available: true, gradient: 'from-red-500 to-rose-500' },
    { id: 'instagram', name: 'Instagram Post Generator', icon: Instagram, available: false, gradient: 'from-gray-400 to-gray-500' },
    { id: 'bio', name: 'Bio Generator', icon: User, available: true, gradient: 'from-indigo-500 to-purple-500' },
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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Tools ✨
        </h2>
        <p className="text-gray-600 text-sm sm:text-base px-2">Choose a tool to generate amazing content</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full h-auto p-4 sm:p-6 rounded-lg"
                  onClick={() => tool.available && setSelectedTool(tool.id)}
                  disabled={!tool.available}
                >
                  <div className="flex flex-col items-center space-y-3 w-full">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tool.gradient} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 ${!tool.available ? 'grayscale' : ''}`}>
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className={`font-semibold text-sm sm:text-base ${tool.available ? 'text-gray-800' : 'text-gray-400'}`}>
                        {tool.name}
                      </p>
                      {!tool.available && (
                        <p className="text-xs text-gray-400">Coming soon</p>
                      )}
                    </div>
                    {tool.available && (
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    )}
                  </div>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-xs text-gray-500 bg-gray-50 rounded-full px-4 py-2 inline-block">
          Made with ❤️ by Sajid
        </p>
      </div>
    </div>
  );
};

export default ToolsSection;
