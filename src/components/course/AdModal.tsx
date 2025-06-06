
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Download } from 'lucide-react';

interface AdModalProps {
  onComplete: () => void;
  onClose: () => void;
}

const AdModal = ({ onComplete, onClose }: AdModalProps) => {
  const [currentAd, setCurrentAd] = useState(1);
  const [countdown, setCountdown] = useState(5);
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

  const handleNextAd = () => {
    if (currentAd < totalAds) {
      setCurrentAd(currentAd + 1);
      setCountdown(5);
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
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Ad {currentAd} of {totalAds}</h3>
              <p className="text-blue-100">Please watch the ad to access your free course</p>
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
        <div className="p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl">
            {/* Adsterra Ad Script Container */}
            <div 
              id={`ad-container-${currentAd}`}
              className="mb-6 min-h-[200px] bg-gray-100 rounded-lg flex items-center justify-center"
              dangerouslySetInnerHTML={{
                __html: `
                  <script type="text/javascript">
                    atOptions = {
                      'key' : '1189490da0458b9766bfb9a72750d0b4',
                      'format' : 'iframe',
                      'height' : 90,
                      'width' : 728,
                      'params' : {}
                    };
                  </script>
                  <script type="text/javascript" src="//www.highperformanceformat.com/1189490da0458b9766bfb9a72750d0b4/invoke.js"></script>
                `
              }}
            />
            
            {/* Fallback content if ad doesn't load */}
            <div className="text-gray-600 mb-6">
              <h4 className="text-lg font-semibold mb-2">Ad Loading...</h4>
              <p>Showing ad {currentAd} of {totalAds}</p>
            </div>

            {/* Countdown and Skip */}
            <div className="space-y-4">
              {!canSkip ? (
                <div className="text-gray-600">
                  <p>You can skip this ad in {countdown} seconds...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentAd < totalAds ? (
                    <Button
                      onClick={handleNextAd}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                    >
                      Next Ad ({currentAd + 1}/{totalAds})
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextAd}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg animate-pulse"
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
        <div className="p-4 bg-gray-50 text-center border-t">
          <p className="text-sm text-gray-600">
            Thanks for watching! Ads help us keep this course free for everyone. 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdModal;
