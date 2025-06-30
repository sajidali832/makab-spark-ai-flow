
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Target, Download } from 'lucide-react';
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
    { name: 'Social Media Posts', value: 35, color: '#8884d8' },
    { name: 'Blog Articles', value: 25, color: '#82ca9d' },
    { name: 'Email Templates', value: 20, color: '#ffc658' },
    { name: 'Captions', value: 15, color: '#ff7300' },
    { name: 'Other', value: 5, color: '#00ff88' }
  ];

  const performanceMetrics = [
    { label: 'Total Messages', value: '108', change: '+12%', icon: Users, color: 'text-blue-600' },
    { label: 'Tools Used', value: '50', change: '+8%', icon: Target, color: 'text-green-600' },
    { label: 'Avg. Response Time', value: '1.2s', change: '-5%', icon: Clock, color: 'text-purple-600' },
    { label: 'Content Exported', value: '18', change: '+25%', icon: Download, color: 'text-orange-600' }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Enhanced Analytics</h2>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button onClick={exportReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                  <Badge className={`mt-2 ${metric.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {metric.change}
                  </Badge>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="messages" stroke="#8884d8" strokeWidth={2} name="Messages" />
                <Line type="monotone" dataKey="tools" stroke="#82ca9d" strokeWidth={2} name="Tools Used" />
                <Line type="monotone" dataKey="exports" stroke="#ffc658" strokeWidth={2} name="Exports" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="messages" fill="#8884d8" name="Messages" />
                  <Bar dataKey="tools" fill="#82ca9d" name="Tools" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tool Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Most Used Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={toolsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {toolsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Insights & Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800">Peak Usage Day</p>
                <p className="text-sm text-gray-600">Thursday shows the highest activity with 22 messages and 12 tool uses.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800">Popular Content Type</p>
                <p className="text-sm text-gray-600">Social media posts are your most generated content type at 35%.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800">Growth Opportunity</p>
                <p className="text-sm text-gray-600">Consider exploring blog articles and email templates for more diverse content.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAnalytics;
