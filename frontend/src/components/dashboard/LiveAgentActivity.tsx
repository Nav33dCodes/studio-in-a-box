import { Terminal, CheckCircle2, CircleDashed } from 'lucide-react';

interface Props {
  status: 'idle' | 'analyzing' | 'complete';
}

export default function LiveAgentActivity({ status }: Props) {
  const getEvents = () => {
    if (status === 'idle') return [{ id: 1, text: 'Awaiting instructions...', status: 'pending', time: new Date().toLocaleTimeString() }];
    if (status === 'analyzing') return [
      { id: 1, text: 'Transmitting prompt to Agent...', status: 'complete', time: new Date().toLocaleTimeString() },
      { id: 2, text: 'Awaiting LLM reasoning & MCP tools...', status: 'pending', time: new Date().toLocaleTimeString() }
    ];
    return [
      { id: 1, text: 'Director Agent activated', status: 'complete', time: new Date().toLocaleTimeString() },
      { id: 2, text: 'ClickHouse MCP tool requested', status: 'complete', time: new Date().toLocaleTimeString() },
      { id: 3, text: 'Query executed against database', status: 'complete', time: new Date().toLocaleTimeString() },
      { id: 4, text: 'Analysis returned to user', status: 'complete', time: new Date().toLocaleTimeString() }
    ];
  };

  const events = getEvents();

  return (
    <div className="border border-border bg-surface rounded-lg flex flex-col h-[300px]">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Terminal className="w-4 h-4 text-secondary" />
        <h3 className="text-sm font-semibold text-primary tracking-widest uppercase">Agent Activity</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-mono text-xs">
        {events.map((evt, i) => (
          <div key={evt.id} className="flex gap-3 relative">
            {/* Timeline line */}
            {i !== events.length - 1 && (
              <div className="absolute left-[7px] top-4 bottom-[-12px] w-px bg-border z-0"></div>
            )}
            
            <div className="relative z-10 bg-surface">
              {evt.status === 'complete' ? (
                <CheckCircle2 className="w-4 h-4 text-accent-blue" />
              ) : (
                <CircleDashed className="w-4 h-4 text-secondary animate-spin-slow" />
              )}
            </div>
            
            <div className="flex flex-col gap-0.5 mt-0.5">
              <span className={evt.status === 'complete' ? 'text-primary' : 'text-secondary'}>
                {evt.text}
              </span>
              <span className="text-secondary/50">{evt.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
