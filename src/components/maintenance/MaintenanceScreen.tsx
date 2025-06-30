
import { useState, useEffect } from 'react';
import { Clock, RefreshCw } from 'lucide-react';

const MaintenanceScreen = () => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check if maintenance period is stored in localStorage
    let maintenanceEnd = localStorage.getItem('maintenance_end');
    
    if (!maintenanceEnd) {
      // Set maintenance period for 15 hours from now
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 15);
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
        localStorage.removeItem('maintenance_end');
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    if (isComplete) {
      window.location.reload();
    }
  };

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
            The app is ready to use again.
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
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <img 
              src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" 
              alt="Makab" 
              className="w-16 h-16 rounded-full" 
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
        
        <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
          We are currently fixing some errors and improving our services. 
          We'll be back online soon!
        </p>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-orange-600 mr-2" />
            <span className="text-lg font-semibold text-gray-700">Back Online In:</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">Hours</div>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-bold text-red-600">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">Minutes</div>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-bold text-pink-600">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">Seconds</div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <div className="w-2 h-2 bg-orange-500 rounded-full opacity-75"></div>
          <span className="text-sm font-medium">Fixing errors and improving services...</span>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
