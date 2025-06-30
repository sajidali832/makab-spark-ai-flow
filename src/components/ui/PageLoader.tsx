
import { LoaderCircle } from "lucide-react";

const PageLoader = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <LoaderCircle className="animate-spin text-blue-500" size={32} />
  </div>
);

export default PageLoader;
