
import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Lightbulb, BarChart3, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FeatureIntroduction = () => {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check if user has seen the introduction before
    const hasSeenIntro = localStorage.getItem('content_hub_intro_seen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem('content_hub_intro_seen', 'true');
    setShowIntro(false);
  };

  const handleSkip = () => {
    localStorage.setItem('content_hub_intro_seen', 'true');
    setShowIntro(false);
  };

  if (!showIntro) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-2xl animate-fade-in">
        <CardHeader className="text-center pb-4 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">
            Welcome to Content Hub!
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Your all-in-one content management solution
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800">Content Calendar</p>
                <p className="text-xs text-gray-600 leading-relaxed">Plan and schedule your content across platforms</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Lightbulb className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800">Smart Ideas</p>
                <p className="text-xs text-gray-600 leading-relaxed">AI-powered content suggestions and inspiration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800">Analytics</p>
                <p className="text-xs text-gray-600 leading-relaxed">Track performance and optimize your content</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <Download className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800">Export Tools</p>
                <p className="text-xs text-gray-600 leading-relaxed">Export content in multiple formats</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline"
              onClick={handleSkip}
              className="flex-1 text-sm"
            >
              Skip
            </Button>
            <Button 
              onClick={handleContinue}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-sm"
            >
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureIntroduction;
