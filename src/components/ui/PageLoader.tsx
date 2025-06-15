
import { LoaderCircle } from "lucide-react";

const PageLoader = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
    <div className="flex flex-col items-center space-y-4 animate-scale-in">
      <div className="relative">
        <LoaderCircle className="animate-spin text-blue-500" size={36} />
        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse"></div>
      </div>
      <div className="text-sm text-gray-600 font-medium animate-pulse">Loading...</div>
    </div>
  </div>
);

export default PageLoader;
