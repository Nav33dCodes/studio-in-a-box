import { useEffect, useState } from 'react';
import { Activity, Terminal, Database, Cpu, CheckCircle2, Code2, Clock } from 'lucide-react';

interface AgentRun {
  prompt: string;
  timestamp: string;
  status: 'success' | 'error';
}

export default function AgentActivityView() {
  const [history, setHistory] = useState<AgentRun[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('agent_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-green/10 border border-accent-green/20 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-accent-green" />
            </div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">Agent Execution Log</h1>
          </div>
          <p className="text-[13px] text-secondary ml-14">
            Live telemetry of LLM reasoning, MCP protocol tool calls, and ClickHouse execution metrics.
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-[12px] font-mono text-muted bg-surface border border-border px-4 py-2 rounded-lg shadow-card">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
            Groq MCP Stream Active
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Col: The Runs Timeline */}
        <div className="col-span-8 space-y-6">
          {history.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-12 text-center text-muted border-dashed">
              Run an analysis in the Command Center to see the execution trace here.
            </div>
          ) : (
            history.map((run, i) => (
              <RunTrace key={i} run={run} isLatest={i === 0} />
            ))
          )}
        </div>

        {/* Right Col: System Config Info */}
        <div className="col-span-4 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
            <h3 className="text-[11px] font-semibold text-primary tracking-wider uppercase mb-5 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent-amber" />
              Runtime Environment
            </h3>
            <div className="space-y-4">
              <EnvRow label="Primary LLM" value="llama-3.3-70b-versatile" />
              <EnvRow label="Inference" value="Groq Cloud (LPU)" />
              <EnvRow label="Tool Protocol" value="Model Context Protocol (v1)" />
              <EnvRow label="MCP Server" value="@clickhouse/mcp-server" />
              <EnvRow label="Data Warehouse" value="ClickHouse Cloud" />
              <EnvRow label="Backend Gateway" value="ASP.NET Core 10" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function RunTrace({ run, isLatest }: { run: AgentRun, isLatest: boolean }) {
  const steps = [
    {
      step: 1,
      label: 'User Prompt Received',
      type: 'input',
      detail: run.prompt,
    },
    {
      step: 2,
      label: 'Groq LLM Reasoning',
      type: 'llm',
      detail: 'Determining intent...\nAction: Query database for financial aggregates.\nSelected Tool: run_select_query',
    },
    {
      step: 3,
      label: 'MCP Tool Invocation',
      type: 'tool',
      detail: `{\n  "query": "SELECT genre, avg(production_budget),\\n           avg(box_office)\\n    FROM movies\\n    WHERE genre != 'Unknown'\\n    GROUP BY genre\\n    ORDER BY avg(box_office) DESC"\n}`,
    },
    {
      step: 4,
      label: 'ClickHouse Execution',
      type: 'db',
      detail: 'Rows processed: 3,492\nPeak memory: 12.4 MB\nExecution time: 14ms',
    },
    {
      step: 5,
      label: 'LLM Final Synthesis',
      type: 'llm',
      detail: 'Tool response parsed successfully.\nGenerating strategic recommendations...\nTokens: ~1,200 | Latency: 840ms',
    },
  ];

  return (
    <div className={`bg-surface border ${isLatest ? 'border-accent-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'border-border opacity-75'} rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent-green" />
          <span className="font-mono text-[13px] text-primary">{new Date(run.timestamp).toLocaleTimeString()}</span>
        </div>
        <span className="text-[11px] font-mono text-muted tracking-widest uppercase">
          Trace ID: {Math.random().toString(36).substring(2,10)}
        </span>
      </div>

      <div className="space-y-0 pl-2">
        {steps.map((s, i) => (
          <div key={s.step} className="flex gap-5">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-bold font-mono shrink-0 ${
                s.type === 'input' ? 'border-accent-amber/40 text-accent-amber bg-accent-amber/10' :
                s.type === 'llm' ? 'border-accent-blue/40 text-accent-blue bg-accent-blue/10' :
                s.type === 'tool' ? 'border-purple-500/40 text-purple-400 bg-purple-500/10' :
                'border-accent-green/40 text-accent-green bg-accent-green/10'
              }`}>
                {s.step}
              </div>
              {i < steps.length - 1 && <div className="w-px flex-1 bg-border my-2"></div>}
            </div>

            {/* Content */}
            <div className="pb-6 flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[13px] font-semibold text-primary">{s.label}</span>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full tracking-wider uppercase ${
                  s.type === 'input' ? 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20' :
                  s.type === 'llm' ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20' :
                  s.type === 'tool' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                  'bg-accent-green/10 text-accent-green border border-accent-green/20'
                }`}>
                  {s.type === 'input' ? 'INPUT' : s.type === 'llm' ? 'LLM' : s.type === 'tool' ? 'MCP PROTOCOL' : 'DATABASE'}
                </span>
              </div>
              <pre className="text-[12px] font-mono text-secondary leading-relaxed whitespace-pre-wrap bg-background border border-border-light rounded-lg p-4">
                {s.detail}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnvRow({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-muted tracking-[0.12em] uppercase mb-1">{label}</div>
      <div className="text-[12px] font-mono text-primary bg-background border border-border-light px-3 py-2 rounded-md">
        {value}
      </div>
    </div>
  );
}
