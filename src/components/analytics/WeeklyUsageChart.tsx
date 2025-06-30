
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { format, startOfWeek, endOfWeek, eachWeekOfInterval, subWeeks } from 'date-fns';

interface WeeklyUsageChartProps {
  data: any[] | null | undefined;
}

const WeeklyUsageChart = ({ data }: WeeklyUsageChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500">
        <p className="text-sm sm:text-base text-center px-4">
          No usage data available yet. Start using the app to see your analytics!
        </p>
      </div>
    );
  }

  // Generate last 8 weeks
  const now = new Date();
  const weeks = eachWeekOfInterval({
    start: subWeeks(now, 7),
    end: now
  });

  const chartData = weeks.map(weekStart => {
    const weekEnd = endOfWeek(weekStart);
    const weekData = data.filter(item => {
      const itemDate = new Date(item.created_at);
      return itemDate >= weekStart && itemDate <= weekEnd;
    });

    return {
      week: format(weekStart, 'MMM dd'),
      events: weekData.length,
      chats: weekData.filter(item => item.event_type === 'chat_message').length,
      tools: weekData.filter(item => item.event_type === 'tool_generation').length,
    };
  });

  const chartConfig = {
    events: {
      label: "Total Events",
      color: "#3b82f6",
    },
    chats: {
      label: "Chat Messages",
      color: "#10b981",
    },
    tools: {
      label: "Tool Usage",
      color: "#f59e0b",
    },
  };

  return (
    <div className="h-48 sm:h-64 w-full">
      <ChartContainer config={chartConfig}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <XAxis 
            dataKey="week"
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="events" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default WeeklyUsageChart;
