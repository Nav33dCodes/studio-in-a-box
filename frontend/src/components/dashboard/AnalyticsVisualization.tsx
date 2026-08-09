import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AnalyticsData } from '../../services/api';

interface Props {
  data?: AnalyticsData;
  isLoading: boolean;
}

export default function AnalyticsVisualization({ data, isLoading }: Props) {
  if (isLoading || !data) {
    return (
      <div className="border border-border bg-surface rounded-lg p-6 h-[400px] flex items-center justify-center animate-pulse">
        <div className="text-secondary text-sm font-medium tracking-widest uppercase flex items-center gap-2">
          <span className="animate-spin w-4 h-4 border-2 border-secondary border-t-transparent rounded-full" />
          Loading Analytics...
        </div>
      </div>
    );
  }

  // Format data for chart (simplifying for Bloomberg aesthetic)
  const chartData = data.genres.map(g => ({
    name: g.genre,
    Budget: parseFloat((g.totalBudget / 1000000000).toFixed(2)),
    BoxOffice: parseFloat((g.totalBoxOffice / 1000000000).toFixed(2)),
  }));

  return (
    <div className="border border-border bg-surface rounded-lg p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-semibold text-primary tracking-widest uppercase">Budget vs Box Office</h3>
          <p className="text-xs text-secondary mt-1">Global aggregates by genre (Billions USD)</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 text-xs font-medium text-secondary">
            <div className="w-3 h-3 rounded-sm bg-border"></div> Budget
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <div className="w-3 h-3 rounded-sm bg-accent-blue"></div> Box Office
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `$${value}B`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '6px', color: '#fff' }}
              itemStyle={{ fontSize: 13, fontWeight: 500 }}
              formatter={(value: number) => [`$${value}B`, '']}
            />
            <Bar dataKey="Budget" fill="#333" radius={[2, 2, 0, 0]} />
            <Bar dataKey="BoxOffice" fill="#3291FF" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
