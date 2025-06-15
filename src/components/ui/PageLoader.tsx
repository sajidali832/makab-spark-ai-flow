
import { LoaderCircle } from "lucide-react";

const PageLoader = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
    <div className="flex flex-col items-center space-y-4">
      <LoaderCircle className="animate-spin text-blue-500" size={32} />
      <div className="text-sm text-gray-600 font-medium">Loading...</div>
    </div>
  </div>
);

export default PageLoader;
