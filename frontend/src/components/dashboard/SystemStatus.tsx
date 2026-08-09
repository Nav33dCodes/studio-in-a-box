import { Server, Database, BrainCircuit, Cloud, Code2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

export default function SystemStatus() {
  const { data: isApiHealthy } = useQuery({
    queryKey: ['health'],
    queryFn: api.checkHealth,
    refetchInterval: 5000
  });

  const { isSuccess: isDbOnline } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: api.getDashboardAnalytics,
    retry: false
  });

  const systems = [
    { name: 'ASP.NET Core API', icon: Code2, online: !!isApiHealthy },
    { name: 'ClickHouse Cloud', icon: Database, online: !!isDbOnline },
    { name: 'Groq LLM Agent', icon: BrainCircuit, online: !!isApiHealthy },
    { name: 'ClickHouse MCP', icon: Server, online: !!isApiHealthy },
    { name: 'Google Cloud', icon: Cloud, online: true },
  ];

  const allOk = systems.every(s => s.online);

  return (
    <div className="bg-surface border border-border rounded-lg flex flex-col shadow-card animate-fade-in-delay-3">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-[11px] font-semibold text-primary tracking-[0.12em] uppercase">System Status</h3>
        <div className={`flex items-center gap-1.5 text-[10px] font-mono ${allOk ? 'text-accent-green' : 'text-accent-red'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${allOk ? 'bg-accent-green' : 'bg-accent-red'}`} style={{ animation: 'pulse-dot 2s infinite' }}></span>
          {allOk ? 'NOMINAL' : 'DEGRADED'}
        </div>
      </div>
      
      <div className="p-4 flex flex-col gap-3">
        {systems.map((sys) => (
          <div key={sys.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <sys.icon className="w-3.5 h-3.5 text-muted" />
              <span className="text-[12px] text-secondary">{sys.name}</span>
            </div>
            <span className={`text-[10px] font-mono tracking-wider ${sys.online ? 'text-accent-green' : 'text-accent-red'}`}>
              {sys.online ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
