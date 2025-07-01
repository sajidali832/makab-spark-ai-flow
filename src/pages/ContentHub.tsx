
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
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="h-9 w-9 p-0 flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              Content Hub
            </h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="p-4 space-y-6">
            {/* Mobile-First Tabs */}
            <Tabs defaultValue="calendar" className="w-full">
              {/* Mobile Tab Navigation */}
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm -mx-4 px-4 pb-4">
                <TabsList className="grid w-full grid-cols-2 h-12 mb-4">
                  <TabsTrigger value="calendar" className="text-sm font-medium">
                    📅 Calendar
                  </TabsTrigger>
                  <TabsTrigger value="suggestions" className="text-sm font-medium">
                    💡 Ideas
                  </TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="analytics" className="text-sm font-medium">
                    📊 Analytics
                  </TabsTrigger>
                  <TabsTrigger value="export" className="text-sm font-medium">
                    📤 Export
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <TabsContent value="calendar" className="mt-6">
                <ContentCalendar />
              </TabsContent>

              <TabsContent value="suggestions" className="mt-6">
                <SmartSuggestions />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <EnhancedAnalytics />
              </TabsContent>

              <TabsContent value="export" className="mt-6">
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
