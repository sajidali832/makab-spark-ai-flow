
import { useState } from 'react';
import { Lightbulb, TrendingUp, Calendar, Sparkles } from 'lucide-react';
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
      title: 'New Year Resolutions Content',
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
      title: 'Email Marketing Templates',
      description: 'Create professional email templates for your campaigns',
      type: 'tool',
      category: 'Marketing',
      priority: 'medium'
    }
  ]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'seasonal':
        return <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'personal':
        return <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center space-x-2">
        <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Smart Suggestions</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {suggestions.map(suggestion => (
          <Card key={suggestion.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {getIconForType(suggestion.type)}
                  <CardTitle className="text-sm sm:text-base lg:text-lg truncate">
                    {suggestion.title}
                  </CardTitle>
                </div>
                <Badge className={`${getPriorityColor(suggestion.priority)} text-xs flex-shrink-0`}>
                  {suggestion.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {suggestion.description}
              </p>
              
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="text-xs">
                  {suggestion.category}
                </Badge>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm px-2 sm:px-3">
                  Use Suggestion
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
              <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">
                Personalized Recommendations
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Based on your content history, we suggest focusing on social media posts and blog articles this week.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartSuggestions;
