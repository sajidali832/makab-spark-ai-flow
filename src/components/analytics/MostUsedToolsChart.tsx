
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface MostUsedToolsChartProps {
  data: any[] | null | undefined;
}

const MostUsedToolsChart = ({ data }: MostUsedToolsChartProps) => {
  const isMobile = useIsMobile();

  if (!data || data.length === 0) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500">
        <p className="text-sm sm:text-base text-center px-4">
          No tool usage data available yet. Try using some AI tools to see your analytics!
        </p>
      </div>
    );
  }

  // Group by tool type
  const toolCounts = data.reduce((acc: Record<string, number>, item: any) => {
    const toolType = item.tool_type || 'Unknown';
    acc[toolType] = (acc[toolType] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(toolCounts)
    .map(([name, value]) => ({ name: String(name), value: Number(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 tools

  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];

  const chartConfig = {
    tools: {
      label: "Tools Used",
    },
  };

  return (
    <div className="h-48 sm:h-64 w-full">
      <ChartContainer config={chartConfig}>
        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={isMobile ? 25 : 40}
            outerRadius={isMobile ? 60 : 80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip 
            content={<ChartTooltipContent />}
          />
        </PieChart>
      </ChartContainer>
      
      {/* Legend */}
      <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm max-h-24 overflow-y-auto">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="truncate text-xs sm:text-sm">{entry.name} ({entry.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostUsedToolsChart;
