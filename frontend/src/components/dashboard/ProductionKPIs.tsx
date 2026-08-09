import { DollarSign, TrendingUp, Film, Activity } from 'lucide-react';
import { KPIStats } from '../../services/api';

interface Props {
  data?: KPIStats;
  isLoading: boolean;
}

export default function ProductionKPIs({ data, isLoading }: Props) {
  if (isLoading || !data) return <KPISkeleton />;

  const formatBillion = (num: number) => `$${(num / 1000000000).toFixed(2)}B`;

  return (
    <div className="grid grid-cols-4 gap-4">
      <KPICard 
        label="Total Production Budget" 
        value={formatBillion(data.totalBudget)} 
        icon={<DollarSign className="w-4 h-4 text-secondary" />} 
      />
      <KPICard 
        label="Global Box Office" 
        value={formatBillion(data.totalBoxOffice)} 
        icon={<Activity className="w-4 h-4 text-secondary" />} 
      />
      <KPICard 
        label="Global ROI Average" 
        value={`+${data.roiPercentage.toFixed(1)}%`} 
        icon={<TrendingUp className="w-4 h-4 text-accent-amber" />} 
        valueColor="text-accent-amber"
      />
      <KPICard 
        label="Projects Analyzed" 
        value={data.totalMovies.toLocaleString()} 
        icon={<Film className="w-4 h-4 text-secondary" />} 
      />
    </div>
  );
}

function KPICard({ label, value, icon, valueColor = "text-primary" }: { label: string, value: string, icon: React.ReactNode, valueColor?: string }) {
  return (
    <div className="border border-border bg-surface rounded-lg p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-semibold text-secondary tracking-widest uppercase">{label}</span>
        {icon}
      </div>
      <div className={`text-2xl font-bold font-mono tracking-tight ${valueColor}`}>
        {value}
      </div>
    </div>
  );
}

function KPISkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border border-border bg-surface rounded-lg p-5 h-[104px] animate-pulse">
          <div className="h-3 w-2/3 bg-border rounded mb-6"></div>
          <div className="h-6 w-1/2 bg-border rounded"></div>
        </div>
      ))}
    </div>
  );
}
