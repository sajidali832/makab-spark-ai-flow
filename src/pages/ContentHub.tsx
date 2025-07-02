
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
  const [activeTab, setActiveTab] = useState('calendar');
  const { toast } = useToast();

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

  const handleScheduleContent = () => {
    toast({
      title: "Content Scheduler",
      description: "Opening content creation dialog...",
    });
    // Here you would typically open a modal or navigate to content creation
    console.log("Schedule Content clicked");
  };

  const tabConfig = [
    {
      id: 'calendar',
      label: 'Calendar',
      icon: calendarIcon,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 'suggestions',
      label: 'Ideas',
      icon: ideasIcon,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: analyticsIcon,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      id: 'export',
      label: 'Export',
      icon: exportIcon,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="h-9 w-9 p-0 flex-shrink-0 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-gray-800 truncate">
              Content Hub
            </h1>
          </div>
          <Button
            size="sm"
            onClick={handleScheduleContent}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs px-3 py-2 rounded-lg shadow-md"
          >
            <Plus className="h-3 w-3 mr-1" />
            Create
          </Button>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            {/* Content Area */}
            <div className="flex-1 overflow-auto px-4 py-4 pb-20">
              <TabsContent value="calendar" className="mt-0 h-full">
                <ContentCalendar />
              </TabsContent>

              <TabsContent value="suggestions" className="mt-0 h-full">
                <SmartSuggestions />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0 h-full">
                <EnhancedAnalytics />
              </TabsContent>

              <TabsContent value="export" className="mt-0 h-full">
                <ContentExporter content={sampleContent} />
              </TabsContent>
            </div>

            {/* Bottom Navigation - Mobile First */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
              <TabsList className="w-full h-16 p-0 bg-transparent grid grid-cols-4 gap-0">
                {tabConfig.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`
                      flex flex-col items-center justify-center h-16 px-2 py-2 
                      border-0 rounded-none bg-transparent
                      data-[state=active]:bg-gradient-to-t data-[state=active]:${tab.color}
                      data-[state=active]:text-white data-[state=active]:shadow-md
                      hover:bg-gray-50 data-[state=active]:hover:bg-gradient-to-t 
                      data-[state=active]:${tab.hoverColor}
                      transition-all duration-300 touch-manipulation
                      text-gray-600 data-[state=active]:text-white
                    `}
                  >
                    <img 
                      src={tab.icon} 
                      alt={tab.label} 
                      className="w-5 h-5 mb-1 flex-shrink-0"
                    />
                    <span className="text-xs font-medium leading-tight">
                      {tab.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>
      
      <NotificationPrompt />
      <FeatureIntroduction />
    </div>
  );
};

export default ContentHub;
