
import { useState, useEffect } from 'react';
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
        return <TrendingUp className="h-4 w-4" />;
      case 'seasonal':
        return <Calendar className="h-4 w-4" />;
      case 'personal':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
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
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Lightbulb className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Smart Suggestions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map(suggestion => (
          <Card key={suggestion.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getIconForType(suggestion.type)}
                  <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                </div>
                <Badge className={getPriorityColor(suggestion.priority)}>
                  {suggestion.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{suggestion.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline">{suggestion.category}</Badge>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Use Suggestion
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Personalized Recommendations</h3>
              <p className="text-sm text-gray-600 mt-1">
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
