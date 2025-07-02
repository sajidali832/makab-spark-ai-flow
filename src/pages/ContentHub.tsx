
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
import calendarIcon from '@/assets/calendar-icon.png';
import ideasIcon from '@/assets/ideas-icon.png';
import analyticsIcon from '@/assets/analytics-icon.png';
import exportIcon from '@/assets/export-icon.png';

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
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-20 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="h-10 w-10 p-0 flex-shrink-0 touch-button rounded-lg hover:bg-white/80"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent truncate">
              Content Hub
            </h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-purple-50 scroll-60fps">
          <div className="p-4 space-y-4 pb-8 safe-bottom">
            {/* Mobile-First Navigation */}
            <Tabs defaultValue="calendar" className="w-full">
              {/* Mobile-First Navigation */}
              <div className="mb-6">
                <TabsList className="w-full h-auto p-1 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="flex gap-1 overflow-x-auto scrollbar-hide touch-manipulation" style={{ scrollBehavior: 'smooth' }}>
                    <TabsTrigger 
                      value="calendar" 
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 text-xs font-medium whitespace-nowrap min-w-[100px] flex-shrink-0 touch-manipulation hover:bg-gray-100 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-blue-600 data-[state=active]:hover:to-blue-700"
                    >
                      <img src={calendarIcon} alt="Calendar" className="w-3.5 h-3.5" />
                      Calendar
                    </TabsTrigger>
                    <TabsTrigger 
                      value="suggestions" 
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 text-xs font-medium whitespace-nowrap min-w-[100px] flex-shrink-0 touch-manipulation hover:bg-gray-100 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-purple-600 data-[state=active]:hover:to-purple-700"
                    >
                      <img src={ideasIcon} alt="Ideas" className="w-3.5 h-3.5" />
                      Ideas
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analytics" 
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 text-xs font-medium whitespace-nowrap min-w-[100px] flex-shrink-0 touch-manipulation hover:bg-gray-100 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-green-600 data-[state=active]:hover:to-green-700"
                    >
                      <img src={analyticsIcon} alt="Analytics" className="w-3.5 h-3.5" />
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger 
                      value="export" 
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 text-xs font-medium whitespace-nowrap min-w-[100px] flex-shrink-0 touch-manipulation hover:bg-gray-100 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-orange-600 data-[state=active]:hover:to-orange-700"
                    >
                      <img src={exportIcon} alt="Export" className="w-3.5 h-3.5" />
                      Export
                    </TabsTrigger>
                  </div>
                </TabsList>
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
