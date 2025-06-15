
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface MostUsedToolsChartProps {
  data: any[] | null | undefined;
}

const MostUsedToolsChart = ({ data }: MostUsedToolsChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No tool usage data available yet. Try using some AI tools to see your analytics!</p>
      </div>
    );
  }

  // Group by tool type
  const toolCounts = data.reduce((acc, item) => {
    const toolType = item.tool_type || 'Unknown';
    acc[toolType] = (acc[toolType] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(toolCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
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
    <div className="h-64 w-full">
      <ChartContainer config={chartConfig}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value: any, name: any) => [value, name]}
          />
        </PieChart>
      </ChartContainer>
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="truncate">{entry.name} ({entry.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostUsedToolsChart;
