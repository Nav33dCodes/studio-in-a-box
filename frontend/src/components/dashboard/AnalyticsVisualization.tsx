import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { AnalyticsData } from '../../services/api';

interface Props {
  data?: AnalyticsData;
  isLoading: boolean;
}

const CHART_COLORS = ['#3b82f6', '#e8a634', '#22c55e', '#a855f7', '#ef4444'];

export default function AnalyticsVisualization({ data, isLoading }: Props) {
  if (isLoading || !data) {
    return (
      <div className="bg-surface border border-border rounded-lg p-5 h-[360px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[12px] text-muted">
          <span className="animate-spin w-3.5 h-3.5 border-2 border-muted border-t-transparent rounded-full" />
          Loading analytics...
        </div>
      </div>
    );
  }

  const chartData = data.genres.map((g, i) => ({
    name: g.genre,
    Budget: parseFloat((g.totalBudget / 1e9).toFixed(2)),
    BoxOffice: parseFloat((g.totalBoxOffice / 1e9).toFixed(2)),
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex flex-col h-[360px] shadow-card animate-fade-in-delay-2">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-[13px] font-semibold text-primary tracking-wider uppercase">Budget vs Box Office</h3>
          <p className="text-[11px] text-muted mt-0.5">By genre · Billions USD</p>
        </div>
        <div className="flex gap-3 items-center text-[11px]">
          <div className="flex items-center gap-1.5 text-muted">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#252525]"></div> Budget
          </div>
          <div className="flex items-center gap-1.5 text-primary">
            <div className="w-2.5 h-2.5 rounded-sm bg-accent-blue"></div> Box Office
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }} barGap={3} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#151515" vertical={false} />
            <XAxis 
              dataKey="name" stroke="#555" fontSize={11} tickLine={false} axisLine={false} dy={8}
              fontFamily="Inter"
            />
            <YAxis 
              stroke="#555" fontSize={11} tickLine={false} axisLine={false}
              tickFormatter={(v) => `$${v}B`}
              fontFamily="JetBrains Mono"
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.015)' }}
              contentStyle={{ 
                backgroundColor: '#0c0c0c', 
                borderColor: '#1a1a1a', 
                borderRadius: '8px', 
                color: '#f0f0f0',
                fontSize: '12px',
                fontFamily: 'Inter',
                padding: '8px 12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
              formatter={(value: number, name: string) => [`$${value}B`, name]}
            />
            <Bar dataKey="Budget" fill="#252525" radius={[3, 3, 0, 0]} />
            <Bar dataKey="BoxOffice" radius={[3, 3, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
