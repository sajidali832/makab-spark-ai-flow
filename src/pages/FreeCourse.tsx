
import { useState } from 'react';
import FreeCourseSection from '@/components/course/FreeCourseSection';
import Sidebar from '@/components/chat/Sidebar';

const FreeCourse = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-0">
        <div className="flex items-center p-3 sm:p-4 border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-3 sm:ml-4 text-lg sm:text-xl font-semibold">Free Course</h1>
        </div>
        <div className="flex-1 overflow-auto">
          <FreeCourseSection />
        </div>
      </div>
    </div>
  );
};

export default FreeCourse;
