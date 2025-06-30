
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/chat/Sidebar';
import ContentCalendar from '@/components/calendar/ContentCalendar';
import SmartSuggestions from '@/components/suggestions/SmartSuggestions';
import ContentExporter from '@/components/export/ContentExporter';
import EnhancedAnalytics from '@/components/analytics/EnhancedAnalytics';
import NotificationPrompt from '@/components/notifications/NotificationPrompt';

const ContentHub = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample content data - in real app, this would come from your database
  const sampleContent = [
    {
      id: '1',
      title: 'New Year Social Media Post',
      content: 'Start your 2025 with purpose and passion! What are your goals for this year?',
      type: 'Social Media Post',
      createdAt: '2025-01-01'
    },
    {
      id: '2',
      title: 'AI Trends Blog Article',
      content: 'The landscape of artificial intelligence is evolving rapidly...',
      type: 'Blog Article',
      createdAt: '2025-01-02'
    },
    {
      id: '3',
      title: 'Marketing Email Template',
      content: 'Subject: Exclusive offer just for you! Dear valued customer...',
      type: 'Email Template',
      createdAt: '2025-01-02'
    }
  ];

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col lg:ml-0">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 lg:hidden bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="h-8 w-8 p-0 mr-2 sm:mr-3"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <h1 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent truncate">
              Content Hub
            </h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                Content Hub
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage, plan, and analyze your content creation journey
              </p>
            </div>

            <Tabs defaultValue="calendar" className="space-y-4 sm:space-y-6">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-4 min-w-[320px] h-auto">
                  <TabsTrigger value="calendar" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                    Calendar
                  </TabsTrigger>
                  <TabsTrigger value="suggestions" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                    Suggestions
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="export" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                    Export
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="calendar" className="space-y-4 sm:space-y-6">
                <ContentCalendar />
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4 sm:space-y-6">
                <SmartSuggestions />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
                <EnhancedAnalytics />
              </TabsContent>

              <TabsContent value="export" className="space-y-4 sm:space-y-6">
                <ContentExporter content={sampleContent} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <NotificationPrompt />
    </div>
  );
};

export default ContentHub;
