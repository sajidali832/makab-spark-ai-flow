
import { LoaderCircle } from "lucide-react";

const PageLoader = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
          <img 
            src="/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png" 
            alt="Makab" 
            className="w-12 h-12 rounded-xl" 
          />
        </div>
        <div className="absolute -bottom-2 -right-2">
          <LoaderCircle className="animate-spin text-blue-500" size={20} />
        </div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold mb-1">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MAKAB
          </span>
        </div>
        <div className="text-sm text-gray-600">Loading...</div>
      </div>
    </div>
  </div>
);

export default PageLoader;
