import { DollarSign, TrendingUp, Film, Activity } from 'lucide-react';
import { KPIStats } from '../../services/api';

interface Props {
  data?: KPIStats;
  isLoading: boolean;
}

export default function ProductionKPIs({ data, isLoading }: Props) {
  if (isLoading || !data) return <KPISkeleton />;

  const fmt = (n: number) => {
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
    return `$${n.toLocaleString()}`;
  };

  const cards = [
    { label: 'Total Budget', value: fmt(data.totalBudget), icon: DollarSign, color: 'text-secondary' },
    { label: 'Box Office', value: fmt(data.totalBoxOffice), icon: Activity, color: 'text-secondary' },
    { label: 'Avg ROI', value: `+${data.roiPercentage.toFixed(1)}%`, icon: TrendingUp, color: 'text-accent-green' },
    { label: 'Movies', value: data.totalMovies.toLocaleString(), icon: Film, color: 'text-secondary' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 animate-fade-in-delay">
      {cards.map((c, i) => (
        <div key={c.label} className="bg-surface border border-border rounded-lg p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-muted tracking-[0.12em] uppercase">{c.label}</span>
            <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
          </div>
          <div className={`text-xl font-bold font-mono tracking-tight ${c.color === 'text-accent-green' ? 'text-accent-green' : 'text-primary'}`}>
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function KPISkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-surface border border-border rounded-lg p-4 h-[88px]">
          <div className="h-2.5 w-16 skeleton rounded mb-5"></div>
          <div className="h-5 w-20 skeleton rounded"></div>
        </div>
      ))}
    </div>
  );
}
