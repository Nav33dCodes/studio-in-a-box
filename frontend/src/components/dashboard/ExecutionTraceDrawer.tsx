import { X, Code, Database, ChevronDown } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExecutionTraceDrawer({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 w-[480px] bg-surface border-l border-border z-50 flex flex-col">
        <div className="h-12 border-b border-border flex items-center justify-between px-5 shrink-0">
          <h2 className="text-[12px] font-semibold tracking-[0.12em] text-primary uppercase">Execution Trace</h2>
          <button onClick={onClose} className="text-muted hover:text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-[11px] text-muted">MCP tool invocation metadata from the most recent analysis.</p>

          <TraceBlock 
            icon={<Code className="w-3.5 h-3.5" />}
            title="TOOL CALL"
            subtitle="mcp.clickhouse.run_select_query"
            code={`{\n  "query": "SELECT avg(production_budget),\n           avg(box_office)\n    FROM movies\n    WHERE genre = 'Sci-Fi'\n      AND vfx_intensity = 'High'"\n}`}
          />

          <div className="flex justify-center text-border">
            <ChevronDown className="w-4 h-4" />
          </div>

          <TraceBlock 
            icon={<Database className="w-3.5 h-3.5" />}
            title="TOOL RESULT"
            subtitle="2 rows · 14ms"
            code={`[\n  {\n    "avg(production_budget)": 135000000,\n    "avg(box_office)": 380000000\n  }\n]`}
            isResult
          />
        </div>
      </div>
    </>
  );
}

function TraceBlock({ icon, title, subtitle, code, isResult }: { icon: React.ReactNode, title: string, subtitle: string, code: string, isResult?: boolean }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className={`px-3.5 py-2.5 border-b border-border flex items-center justify-between ${isResult ? 'bg-accent-blue/5' : 'bg-surface-raised'}`}>
        <div className="flex items-center gap-2">
          <div className={isResult ? 'text-accent-blue' : 'text-muted'}>{icon}</div>
          <span className="text-[11px] font-semibold text-primary tracking-wider">{title}</span>
        </div>
        <span className="text-[10px] font-mono text-muted">{subtitle}</span>
      </div>
      <div className="p-3.5 bg-background">
        <pre className="text-[11px] font-mono text-secondary leading-relaxed whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
