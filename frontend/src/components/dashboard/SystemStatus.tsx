import { Server, Database, BrainCircuit, Cloud, Code2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

export default function SystemStatus() {
  const { data: isApiHealthy } = useQuery({
    queryKey: ['health'],
    queryFn: api.checkHealth,
    refetchInterval: 5000 // poll every 5s
  });

  const { isSuccess: isDbOnline } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: api.getDashboardAnalytics,
    retry: false
  });

  const systems = [
    { name: 'ASP.NET Core Web API', icon: <Code2 className="w-4 h-4" />, status: isApiHealthy ? 'ONLINE' : 'OFFLINE' },
    { name: 'ClickHouse Cloud Database', icon: <Database className="w-4 h-4" />, status: isDbOnline ? 'ONLINE' : 'OFFLINE' },
    { name: 'Groq Agent Platform', icon: <BrainCircuit className="w-4 h-4" />, status: isApiHealthy ? 'READY' : 'OFFLINE' },
    { name: 'ClickHouse MCP Server', icon: <Server className="w-4 h-4" />, status: isApiHealthy ? 'READY' : 'OFFLINE' },
    { name: 'Google Cloud Infrastructure', icon: <Cloud className="w-4 h-4" />, status: 'ONLINE' },
  ];

  const allNominal = isApiHealthy && isDbOnline;

  return (
    <div className="border border-border bg-surface rounded-lg flex flex-col flex-1">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary tracking-widest uppercase">System Status</h3>
        <div className={`flex items-center gap-1.5 text-xs font-medium ${allNominal ? 'text-green-500' : 'text-red-500'}`}>
          <div className={`w-2 h-2 rounded-full ${allNominal ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          {allNominal ? 'ALL SYSTEMS NOMINAL' : 'SYSTEM ERROR'}
        </div>
      </div>
      
      <div className="p-4 flex flex-col gap-4">
        {systems.map((sys) => (
          <div key={sys.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-secondary">{sys.icon}</div>
              <span className="text-sm text-primary">{sys.name}</span>
            </div>
            <div className={`text-xs font-mono uppercase ${sys.status === 'OFFLINE' ? 'text-red-500' : 'text-green-500'}`}>
              {sys.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
