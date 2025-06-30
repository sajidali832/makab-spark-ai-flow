
import { useState, useEffect } from 'react';
import { Clock, RefreshCw, CheckCircle, Calendar, Lightbulb, BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MaintenanceScreen = () => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  const [isComplete, setIsComplete] = useState(false);
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);

  useEffect(() => {
    // Check if maintenance period is stored in localStorage
    let maintenanceEnd = localStorage.getItem('maintenance_end');
    
    if (!maintenanceEnd) {
      // Set maintenance period for 14 hours from now
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 14);
      maintenanceEnd = endTime.toISOString();
      localStorage.setItem('maintenance_end', maintenanceEnd);
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(maintenanceEnd!).getTime();
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setIsComplete(true);
        setShowFeaturePopup(true);
        localStorage.removeItem('maintenance_end');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    if (isComplete) {
      window.location.reload();
    }
  };

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

  if (isComplete && showFeaturePopup) {
    return <FeaturePopup />;
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Maintenance Complete!
          </h1>
          <p className="text-gray-600 mb-6">
            The app is ready with new features.
          </p>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-colors duration-300"
          >
            Launch App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-12 max-w-lg w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <img 
              src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" 
              alt="Makab" 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" 
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4">
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            MAKAB
          </span>
        </h1>
        
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
          Under Maintenance
        </h2>
        
        <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed px-2">
          We are currently fixing some errors and adding new features. 
          We'll be back online soon with exciting updates!
        </p>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-4 sm:p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 mr-2" />
            <span className="text-base sm:text-lg font-semibold text-gray-700">Back Online In:</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="text-xl sm:text-3xl font-bold text-orange-600">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">Hours</div>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="text-xl sm:text-3xl font-bold text-red-600">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">Minutes</div>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="text-xl sm:text-3xl font-bold text-pink-600">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">Seconds</div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <div className="w-2 h-2 bg-orange-500 rounded-full opacity-75"></div>
          <span className="text-xs sm:text-sm font-medium">Adding new features and fixing errors...</span>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
