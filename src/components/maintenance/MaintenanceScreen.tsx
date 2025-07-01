
import { useState } from 'react';
import { CheckCircle, Calendar, Lightbulb, BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MaintenanceScreen = () => {
  const [showFeaturePopup, setShowFeaturePopup] = useState(true);

  const handleTryNow = () => {
    setShowFeaturePopup(false);
    window.location.reload();
  };

  // Feature Popup Component
  const FeaturePopup = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto bg-white shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">
            New Features Ready!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">Content Calendar</p>
                <p className="text-xs text-gray-600">Plan and schedule your content</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded-lg">
              <Lightbulb className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">Smart Suggestions</p>
                <p className="text-xs text-gray-600">AI-powered content ideas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">Enhanced Analytics</p>
                <p className="text-xs text-gray-600">Track your content performance</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded-lg">
              <Download className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">Content Export</p>
                <p className="text-xs text-gray-600">Export in multiple formats</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleTryNow}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
          >
            Try Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (showFeaturePopup) {
    return <FeaturePopup />;
  }

  // This will not be shown as the popup is the default state
  return null;
};

export default MaintenanceScreen;
