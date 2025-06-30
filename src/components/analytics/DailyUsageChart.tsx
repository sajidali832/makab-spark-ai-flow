
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';

interface DailyUsageChartProps {
  data: any[] | null | undefined;
}

const DailyUsageChart = ({ data }: DailyUsageChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500">
        <p className="text-sm sm:text-base text-center px-4">
          No usage data available yet. Start using the app to see your analytics!
        </p>
      </div>
    );
  }

  // Group data by date and sum event counts
  const chartData = data.reduce((acc, item) => {
    const date = item.usage_date;
    const existing = acc.find((d: any) => d.date === date);
    
    if (existing) {
      existing.events += item.event_count;
    } else {
      acc.push({
        date,
        events: item.event_count,
        formattedDate: format(parseISO(date), 'MMM dd')
      });
    }
    
    return acc;
  }, []).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartConfig = {
    events: {
      label: "Events",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="h-48 sm:h-64 w-full">
      <ChartContainer config={chartConfig}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="formattedDate"
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
          <Area
            type="monotone"
            dataKey="events"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorEvents)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default DailyUsageChart;
