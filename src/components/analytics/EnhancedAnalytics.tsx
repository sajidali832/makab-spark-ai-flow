
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Target, Download, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EnhancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Sample data - in real app, this would come from your database
  const usageData = [
    { name: 'Mon', messages: 12, tools: 5, exports: 2 },
    { name: 'Tue', messages: 19, tools: 8, exports: 4 },
    { name: 'Wed', messages: 15, tools: 6, exports: 1 },
    { name: 'Thu', messages: 22, tools: 12, exports: 3 },
    { name: 'Fri', messages: 18, tools: 9, exports: 5 },
    { name: 'Sat', messages: 8, tools: 3, exports: 1 },
    { name: 'Sun', messages: 14, tools: 7, exports: 2 }
  ];

  const toolsData = [
    { name: 'Social Media', value: 35, color: '#8B5CF6' },
    { name: 'Blog Articles', value: 25, color: '#06B6D4' },
    { name: 'Email Templates', value: 20, color: '#F59E0B' },
    { name: 'Captions', value: 15, color: '#EF4444' },
    { name: 'Other', value: 5, color: '#10B981' }
  ];

  const performanceMetrics = [
    { label: 'Messages', value: '108', change: '+12%', icon: Users, color: 'text-blue-600' },
    { label: 'Tools Used', value: '50', change: '+8%', icon: Target, color: 'text-green-600' },
    { label: 'Response Time', value: '1.2s', change: '-5%', icon: Clock, color: 'text-purple-600' },
    { label: 'Exports', value: '18', change: '+25%', icon: Download, color: 'text-orange-600' }
  ];

  const exportReport = () => {
    const reportData = {
      period: `Last ${timeRange}`,
      generated: new Date().toISOString(),
      metrics: performanceMetrics,
      usage: usageData,
      tools: toolsData
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">Analytics</h2>
          </div>
          <Button onClick={exportReport} size="sm" variant="outline" className="text-xs px-3 py-2">
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
        
        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Mobile Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="p-3">
            <CardContent className="p-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <Badge className={`text-xs px-2 py-1 ${metric.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {metric.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-600 leading-tight">{metric.label}</p>
                  <p className="text-lg font-bold text-gray-800">{metric.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile Usage Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  name="Messages"
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="tools" 
                  stroke="#06B6D4" 
                  strokeWidth={2} 
                  name="Tools"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Tools Usage */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Most Used Tools</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-3">
            {toolsData.map((tool, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tool.color }}
                  />
                  <span className="text-sm text-gray-700 truncate">{tool.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${tool.value}%`,
                        backgroundColor: tool.color 
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-8 text-right">
                    {tool.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Insights */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-base">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span>Key Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">Peak Day: Thursday</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Highest activity with 22 messages
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">Top Content: Social Media</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  35% of your generated content
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">Growth Tip</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Try more blog articles for diverse content
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAnalytics;
