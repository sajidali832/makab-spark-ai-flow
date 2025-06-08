
import { useEffect } from 'react';

interface BannerAdProps {
  className?: string;
}

const BannerAd = ({ className = "" }: BannerAdProps) => {
  useEffect(() => {
    // Set atOptions before loading the script
    (window as any).atOptions = {
      'key': 'b2aec9ea4efb6df74577dcafa9819fb5',
      'format': 'iframe',
      'height': 60,
      'width': 468,
      'params': {}
    };

    // Load Adsterra banner ad script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//www.highperformanceformat.com/b2aec9ea4efb6df74577dcafa9819fb5/invoke.js';
    
    const adContainer = document.getElementById(`banner-ad-${Math.random()}`);
    if (adContainer) {
      adContainer.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className={`flex justify-center items-center py-4 ${className}`}>
      <div 
        id={`banner-ad-${Math.random()}`}
        className="w-full max-w-lg h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
        style={{ minWidth: '468px', minHeight: '60px' }}
      >
        <div className="text-gray-500 text-center">
          <p className="text-sm">Advertisement</p>
        </div>
      </div>
    </div>
  );
};

export default BannerAd;
