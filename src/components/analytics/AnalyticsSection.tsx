
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyUsageChart from './DailyUsageChart';
import WeeklyUsageChart from './WeeklyUsageChart';
import MostUsedToolsChart from './MostUsedToolsChart';
import ContentTrendsChart from './ContentTrendsChart';
import { Loader2, TrendingUp, Users, Calendar, BarChart3, MessageSquare, Wrench, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const AnalyticsSection = () => {
  const navigate = useNavigate();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('analytics');
  }, [trackPageView]);

  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['user-analytics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: dailySummary } = useQuery({
    queryKey: ['daily-usage-summary'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('daily_usage_summary')
        .select('*')
        .eq('user_id', user.id)
        .order('usage_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data;
    },
  });

  const { data: toolGenerations } = useQuery({
    queryKey: ['tool-generations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tool_generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Unable to load analytics data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalEvents = analyticsData?.length || 0;
  const uniqueDays = new Set(analyticsData?.map(item => new Date(item.created_at).toDateString())).size;
  const toolGenerationsCount = toolGenerations?.length || 0;
  const hasData = totalEvents > 0 || toolGenerationsCount > 0;

  // If no data, show welcome screen
  if (!hasData) {
    return (
      <div className="p-3 sm:p-6 space-y-6">
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Welcome to Analytics! 📊</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Your usage analytics will appear here once you start using Makab AI. 
                Try chatting with the AI or using tools to see your data visualized!
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <Button 
                onClick={() => navigate('/chat')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Chatting
              </Button>
              <Button 
                onClick={() => navigate('/tools')}
                variant="outline"
                className="border-blue-200 hover:bg-blue-50"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Try AI Tools
              </Button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">What gets tracked?</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Chat conversations and messages</li>
                <li>• AI tool usage and generations</li>
                <li>• Daily activity patterns</li>
                <li>• Most used features</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">Events tracked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueDays}</div>
            <p className="text-xs text-muted-foreground">Days with activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toolGenerationsCount}</div>
            <p className="text-xs text-muted-foreground">AI generations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueDays > 0 ? Math.round(totalEvents / uniqueDays) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Events per day</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="daily">Daily Usage</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
          <TabsTrigger value="tools">Most Used Tools</TabsTrigger>
          <TabsTrigger value="content">Content Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Usage Activity</CardTitle>
              <CardDescription>Your daily activity over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <DailyUsageChart data={dailySummary} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Usage Trends</CardTitle>
              <CardDescription>Weekly activity patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <WeeklyUsageChart data={analyticsData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Used Tools</CardTitle>
              <CardDescription>Your frequently used AI tools and features</CardDescription>
            </CardHeader>
            <CardContent>
              <MostUsedToolsChart data={toolGenerations} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Generation Trends</CardTitle>
              <CardDescription>Analysis of your content creation patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ContentTrendsChart data={toolGenerations} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsSection;
