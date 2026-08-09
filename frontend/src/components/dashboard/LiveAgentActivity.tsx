import { Terminal, CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  status: 'idle' | 'analyzing' | 'complete';
}

type EventStatus = 'pending' | 'loading' | 'complete';

interface AgentEvent {
  text: string;
  status: EventStatus;
  time?: string;
  metadata?: string;
}

export default function LiveAgentActivity({ status }: Props) {
  const [events, setEvents] = useState<AgentEvent[]>([]);

  useEffect(() => {
    if (status === 'idle') {
      setEvents([]);
      return;
    }

    if (status === 'analyzing') {
      const now = new Date();
      const formatTime = (d: Date) => d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Start the simulated sequence
      setEvents([
        { text: 'Request received', status: 'complete', time: formatTime(now) },
        { text: 'Production requirements identified', status: 'loading' }
      ]);

      setTimeout(() => setEvents(prev => [
        prev[0],
        { ...prev[1], status: 'complete', time: formatTime(new Date()) },
        { text: 'Querying ClickHouse MCP', status: 'loading' }
      ]), 800);

      setTimeout(() => setEvents(prev => [
        prev[0], prev[1],
        { ...prev[2], status: 'complete', time: formatTime(new Date()), metadata: 'Sci-Fi / High VFX' },
        { text: 'Calculating historical benchmarks', status: 'loading' }
      ]), 1600);

      setTimeout(() => setEvents(prev => [
        prev[0], prev[1], prev[2],
        { ...prev[3], status: 'complete', time: formatTime(new Date()), metadata: '428 records analyzed' },
        { text: 'Generating production recommendation', status: 'loading' }
      ]), 2400);
    }

    if (status === 'complete') {
      setEvents(prev => {
        const last = prev[prev.length - 1];
        if (last && last.status === 'loading') {
          return [
            ...prev.slice(0, -1),
            { ...last, status: 'complete', time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
          ];
        }
        return prev;
      });
    }

  }, [status]);

  return (
    <div className="bg-[#0c0c0c] border border-border rounded-sm flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-fade-in-delay-2 h-full min-h-[300px]">
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <Terminal className="w-4 h-4 text-accent-blue" />
        <h3 className="text-[12px] font-bold text-primary tracking-widest uppercase">Agent Activity</h3>
      </div>
      
      <div className="p-5 flex flex-col gap-4 font-mono text-[11px] overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-secondary italic">No agent activity yet.</div>
        ) : (
          events.map((evt, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center mt-0.5">
                {evt.status === 'complete' ? (
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                ) : evt.status === 'loading' ? (
                  <div className="w-4 h-4 rounded-full border-2 border-accent-blue border-t-transparent animate-spin shrink-0"></div>
                ) : (
                  <CircleDashed className="w-4 h-4 text-muted shrink-0" />
                )}
                {i < events.length - 1 && <div className="w-px h-full bg-border my-1"></div>}
              </div>
              <div className="flex flex-col pb-2">
                {evt.time && <span className="text-[10px] text-muted mb-0.5">{evt.time}</span>}
                <span className={evt.status === 'pending' ? 'text-muted' : 'text-primary'}>
                  {evt.text}
                </span>
                {evt.metadata && (
                  <span className="text-[10px] text-accent-amber mt-1 bg-accent-amber/10 border border-accent-amber/20 px-1.5 py-0.5 rounded-sm self-start">
                    {evt.metadata}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
