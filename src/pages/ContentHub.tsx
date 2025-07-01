
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
import FeatureIntroduction from '@/components/introduction/FeatureIntroduction';

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
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-20 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="h-9 w-9 p-0 flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent truncate">
              Content Hub
            </h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="p-3 space-y-4">
            {/* Mobile-First Tabs */}
            <Tabs defaultValue="calendar" className="w-full">
              {/* Fixed Mobile Tab Navigation */}
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm -mx-3 px-3 pb-3 border-b border-gray-100 mb-4">
                <div className="w-full overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <div className="flex gap-2 pb-2" style={{ minWidth: 'fit-content', width: 'max-content' }}>
                    <TabsTrigger 
                      value="calendar" 
                      className="flex-shrink-0 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-lg bg-white border border-gray-200 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-300 min-w-[100px] touch-manipulation"
                    >
                      📅 Calendar
                    </TabsTrigger>
                    <TabsTrigger 
                      value="suggestions" 
                      className="flex-shrink-0 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-lg bg-white border border-gray-200 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:border-purple-300 min-w-[100px] touch-manipulation"
                    >
                      💡 Ideas
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analytics" 
                      className="flex-shrink-0 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-lg bg-white border border-gray-200 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:border-green-300 min-w-[100px] touch-manipulation"
                    >
                      📊 Analytics
                    </TabsTrigger>
                    <TabsTrigger 
                      value="export" 
                      className="flex-shrink-0 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-lg bg-white border border-gray-200 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:border-orange-300 min-w-[100px] touch-manipulation"
                    >
                      📤 Export
                    </TabsTrigger>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <TabsContent value="calendar" className="mt-0">
                <ContentCalendar />
              </TabsContent>

              <TabsContent value="suggestions" className="mt-0">
                <SmartSuggestions />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <EnhancedAnalytics />
              </TabsContent>

              <TabsContent value="export" className="mt-0">
                <ContentExporter content={sampleContent} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <NotificationPrompt />
      <FeatureIntroduction />
    </div>
  );
};

export default ContentHub;
