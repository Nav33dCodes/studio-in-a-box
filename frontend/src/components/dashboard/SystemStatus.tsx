import { Server, Database, BrainCircuit, Cloud, Code2 } from 'lucide-react';

export default function SystemStatus() {
  const systems = [
    { name: 'Gemini Agent Platform', icon: <BrainCircuit className="w-4 h-4" />, status: 'online' },
    { name: 'Google Cloud Infrastructure', icon: <Cloud className="w-4 h-4" />, status: 'online' },
    { name: 'ClickHouse MCP Server', icon: <Server className="w-4 h-4" />, status: 'online' },
    { name: 'ClickHouse Cloud Database', icon: <Database className="w-4 h-4" />, status: 'online' },
    { name: 'ASP.NET Core Web API', icon: <Code2 className="w-4 h-4" />, status: 'online' },
  ];

  return (
    <div className="border border-border bg-surface rounded-lg flex flex-col flex-1">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary tracking-widest uppercase">System Status</h3>
        <div className="flex items-center gap-1.5 text-xs font-medium text-green-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          ALL SYSTEMS NOMINAL
        </div>
      </div>
      
      <div className="p-4 flex flex-col gap-4">
        {systems.map((sys) => (
          <div key={sys.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-secondary">{sys.icon}</div>
              <span className="text-sm text-primary">{sys.name}</span>
            </div>
            <div className="text-xs font-mono text-green-500 uppercase">
              {sys.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
