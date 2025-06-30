
import { LoaderCircle } from "lucide-react";

const PageLoader = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-fade-in">
    <div className="flex flex-col items-center space-y-4 animate-scale-in">
      <div className="relative">
        {/* Main logo container */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl animate-pulse">
          <img 
            src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" 
            alt="Makab" 
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl animate-fade-in" 
          />
        </div>
        
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-blue-500/30 animate-ping"></div>
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-purple-500/20 animate-pulse"></div>
        
        {/* Spinning loader */}
        <div className="absolute -bottom-2 -right-2">
          <LoaderCircle className="animate-spin text-blue-500" size={24} />
        </div>
      </div>
      
      {/* Loading text with gradient */}
      <div className="text-center animate-fade-in">
        <div className="text-lg sm:text-xl font-bold mb-1">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MAKAB
          </span>
        </div>
        <div className="text-sm text-gray-600 font-medium animate-pulse">Loading your AI companion...</div>
      </div>
      
      {/* Progress dots */}
      <div className="flex space-x-1 animate-fade-in">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
);

export default PageLoader;
