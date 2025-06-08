
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Download, Clock } from 'lucide-react';

interface AdModalProps {
  onComplete: () => void;
  onClose: () => void;
}

const AdModal = ({ onComplete, onClose }: AdModalProps) => {
  const [currentAd, setCurrentAd] = useState(1);
  const [countdown, setCountdown] = useState(9);
  const [canSkip, setCanSkip] = useState(false);
  const totalAds = 8;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentAd]);

  useEffect(() => {
    // Set atOptions before loading the script
    (window as any).atOptions = {
      'key': 'd1df4d0571ff45346fa5cd749b0678a0',
      'format': 'iframe',
      'height': 250,
      'width': 300,
      'params': {}
    };

    // Load Adsterra ad script for each new ad
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//www.highperformanceformat.com/d1df4d0571ff45346fa5cd749b0678a0/invoke.js';
    
    const adContainer = document.getElementById(`ad-container-${currentAd}`);
    if (adContainer) {
      // Clear previous ad content
      adContainer.innerHTML = '';
      adContainer.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [currentAd]);

  const handleNextAd = () => {
    if (currentAd < totalAds) {
      setCurrentAd(currentAd + 1);
      setCountdown(9);
      setCanSkip(false);
    } else {
      // All ads completed, download PDF
      downloadPDF();
    }
  };

  const downloadPDF = () => {
    // Open the Google Drive PDF link
    window.open('https://drive.google.com/file/d/1jWn0sOP5bREXUH3G8lpyJhVEvn2D573V/view?usp=drivesdk', '_blank');
    onComplete();
  };

  const progress = ((currentAd - 1) / totalAds) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="p-4 md:p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-bold">Ad {currentAd} of {totalAds}</h3>
              <p className="text-blue-100 text-sm md:text-base">Please watch the ad to access your free course</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm mt-2 text-blue-100">
              Progress: {currentAd}/{totalAds} ads completed
            </p>
          </div>
        </div>

        {/* Ad Content */}
        <div className="p-4 md:p-8 text-center min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl">
            {/* Adsterra Ad Container */}
            <div 
              id={`ad-container-${currentAd}`}
              className="mb-6 min-h-[250px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
              style={{ minWidth: '300px', minHeight: '250px' }}
            >
              <div className="text-gray-500 text-center">
                <p className="text-lg font-semibold mb-2">Advertisement Loading...</p>
                <p className="text-sm">Ad {currentAd} of {totalAds}</p>
              </div>
            </div>

            {/* Countdown and Skip */}
            <div className="space-y-4">
              {!canSkip ? (
                <div className="text-gray-600">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <p className="text-sm md:text-base">Watch for {countdown} more seconds...</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${((9 - countdown) / 9) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Please wait for the timer to complete</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentAd < totalAds ? (
                    <Button
                      onClick={handleNextAd}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-2 md:py-3 text-base md:text-lg"
                    >
                      Next Ad ({currentAd + 1}/{totalAds})
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextAd}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-2 md:py-3 text-base md:text-lg animate-pulse"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Collect Your Course!
                    </Button>
                  )}
                  <p className="text-sm text-gray-500">
                    {currentAd < totalAds 
                      ? `${totalAds - currentAd} more ads to go!` 
                      : 'All ads completed! Click to download your course.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 md:p-4 bg-gray-50 text-center border-t">
          <p className="text-xs md:text-sm text-gray-600">
            Thanks for watching! Ads help us keep this course free for everyone. 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdModal;
