import { Terminal, CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';

interface Props {
  status: 'idle' | 'analyzing' | 'complete';
}

export default function LiveAgentActivity({ status }: Props) {
  const getEvents = () => {
    if (status === 'idle') return [
      { text: 'Awaiting instructions...', status: 'pending' as const }
    ];
    if (status === 'analyzing') return [
      { text: 'Prompt transmitted to agent', status: 'complete' as const },
      { text: 'LLM reasoning & MCP tool calls...', status: 'loading' as const },
    ];
    return [
      { text: 'Director Agent activated', status: 'complete' as const },
      { text: 'MCP tool: run_select_query', status: 'complete' as const },
      { text: 'ClickHouse query executed', status: 'complete' as const },
      { text: 'Analysis returned', status: 'complete' as const },
    ];
  };

  const events = getEvents();

  return (
    <div className="bg-surface border border-border rounded-lg flex flex-col shadow-card animate-fade-in-delay-2">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Terminal className="w-3.5 h-3.5 text-muted" />
        <h3 className="text-[11px] font-semibold text-primary tracking-[0.12em] uppercase">Agent Activity</h3>
      </div>
      
      <div className="p-4 flex flex-col gap-2.5 font-mono text-[11px]">
        {events.map((evt, i) => (
          <div key={i} className="flex items-start gap-2.5">
            {evt.status === 'complete' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-green shrink-0 mt-0.5" />
            ) : evt.status === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 text-accent-blue shrink-0 mt-0.5 animate-spin" />
            ) : (
              <CircleDashed className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" />
            )}
            <span className={evt.status === 'pending' ? 'text-muted' : 'text-secondary'}>
              {evt.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
