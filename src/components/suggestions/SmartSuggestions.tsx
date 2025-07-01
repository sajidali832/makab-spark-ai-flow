
import { useState } from 'react';
import { Lightbulb, TrendingUp, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: 'trending' | 'seasonal' | 'personal' | 'tool';
  category: string;
  priority: 'high' | 'medium' | 'low';
}

const SmartSuggestions = () => {
  const [suggestions] = useState<Suggestion[]>([
    {
      id: '1',
      title: 'New Year Content',
      description: 'Create engaging posts about goal setting and motivation for the new year',
      type: 'seasonal',
      category: 'Social Media',
      priority: 'high'
    },
    {
      id: '2',
      title: 'AI Trends 2025',
      description: 'Write about the latest AI developments and their impact on businesses',
      type: 'trending',
      category: 'Blog',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Instagram Captions',
      description: 'Based on your recent posts, try creating more engaging captions',
      type: 'personal',
      category: 'Social Media',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Email Templates',
      description: 'Create professional email templates for your campaigns',
      type: 'tool',
      category: 'Marketing',
      priority: 'medium'
    }
  ]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'trending':
        return '🔥';
      case 'seasonal':
        return '📅';
      case 'personal':
        return '✨';
      default:
        return '💡';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-bold text-gray-800">Smart Ideas</h2>
      </div>

      {/* Mobile-Optimized Suggestion Cards */}
      <div className="space-y-3">
        {suggestions.map(suggestion => (
          <Card key={suggestion.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">
                      {getIconForType(suggestion.type)}
                    </span>
                    <h3 className="font-semibold text-sm leading-tight truncate">
                      {suggestion.title}
                    </h3>
                  </div>
                  <Badge className={`${getPriorityColor(suggestion.priority)} text-xs px-2 py-1 border flex-shrink-0`}>
                    {suggestion.priority}
                  </Badge>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-xs leading-relaxed">
                  {suggestion.description}
                </p>
                
                {/* Action Row */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {suggestion.category}
                  </Badge>
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700 text-xs px-3 py-2 h-8"
                  >
                    Use Idea
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile Insights Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="font-semibold text-sm text-gray-800">
                💡 Personal Tips
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Based on your content history, we suggest focusing on social media posts and blog articles this week.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/80 text-xs px-3 py-2 h-8 mt-2"
              >
                View More Tips
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartSuggestions;
