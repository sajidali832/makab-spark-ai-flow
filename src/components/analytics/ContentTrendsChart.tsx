
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { format, startOfDay, subDays, eachDayOfInterval } from 'date-fns';

interface ContentTrendsChartProps {
  data: any[] | null | undefined;
}

const ContentTrendsChart = ({ data }: ContentTrendsChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500">
        <p className="text-sm sm:text-base text-center px-4">
          No content generation data available yet. Create some content to see your trends!
        </p>
      </div>
    );
  }

  // Generate last 14 days
  const now = new Date();
  const days = eachDayOfInterval({
    start: subDays(now, 13),
    end: now
  });

  const chartData = days.map(day => {
    const dayStart = startOfDay(day);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const dayData = data.filter(item => {
      const itemDate = new Date(item.created_at);
      return itemDate >= dayStart && itemDate < dayEnd;
    });

    // Count content by length (rough estimation)
    const shortContent = dayData.filter(item => 
      (item.generated_content?.length || 0) < 500
    ).length;
    
    const mediumContent = dayData.filter(item => {
      const length = item.generated_content?.length || 0;
      return length >= 500 && length < 1500;
    }).length;
    
    const longContent = dayData.filter(item => 
      (item.generated_content?.length || 0) >= 1500
    ).length;

    return {
      date: format(day, 'MMM dd'),
      total: dayData.length,
      short: shortContent,
      medium: mediumContent,
      long: longContent,
    };
  });

  const chartConfig = {
    total: {
      label: "Total Content",
      color: "#3b82f6",
    },
    short: {
      label: "Short Content",
      color: "#10b981",
    },
    medium: {
      label: "Medium Content",
      color: "#f59e0b",
    },
    long: {
      label: "Long Content",
      color: "#ef4444",
    },
  };

  return (
    <div className="h-48 sm:h-64 w-full">
      <ChartContainer config={chartConfig}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <XAxis 
            dataKey="date"
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
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="short"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
          <Line
            type="monotone"
            dataKey="medium"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
          <Line
            type="monotone"
            dataKey="long"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default ContentTrendsChart;
