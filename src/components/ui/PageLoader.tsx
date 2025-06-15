
import { LoaderCircle } from "lucide-react";

const PageLoader = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/55 backdrop-blur-sm animate-fade-in">
    <LoaderCircle className="animate-spin text-blue-500" size={48} />
  </div>
);

export default PageLoader;
