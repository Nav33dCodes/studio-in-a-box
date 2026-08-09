import { X, Code, Database, ChevronRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExecutionTraceDrawer({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-[500px] bg-surface border-l border-border z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0">
          <h2 className="text-sm font-semibold tracking-widest text-primary uppercase">Execution Trace</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-xs text-secondary">
            Displaying safe, user-facing execution metadata for the recent analysis.
          </div>

          <TraceStep 
            icon={<Code className="w-4 h-4" />}
            title="TOOL INVOCATION"
            subtitle="mcp.clickhouse.run_query"
            code={`{\n  "query": "SELECT avg(production_budget), avg(box_office) FROM movies WHERE genre='Sci-Fi' AND vfx_intensity='High'"\n}`}
          />

          <div className="flex justify-center -my-2 text-border">
            <ChevronRight className="w-4 h-4 rotate-90" />
          </div>

          <TraceStep 
            icon={<Database className="w-4 h-4" />}
            title="TOOL RESULT"
            subtitle="2 rows retrieved in 14ms"
            code={`[\n  {\n    "avg(production_budget)": 135000000,\n    "avg(box_office)": 380000000\n  }\n]`}
            isSuccess
          />

        </div>
      </div>
    </>
  );
}

function TraceStep({ icon, title, subtitle, code, isSuccess = false }: { icon: React.ReactNode, title: string, subtitle: string, code: string, isSuccess?: boolean }) {
  return (
    <div className="border border-border rounded-lg bg-background overflow-hidden">
      <div className={`p-3 border-b border-border flex items-center justify-between ${isSuccess ? 'bg-accent-blue/5' : 'bg-surface-raised'}`}>
        <div className="flex items-center gap-2">
          <div className={isSuccess ? 'text-accent-blue' : 'text-secondary'}>
            {icon}
          </div>
          <span className="text-xs font-semibold text-primary">{title}</span>
        </div>
        <span className="text-xs font-mono text-secondary">{subtitle}</span>
      </div>
      <div className="p-4 overflow-x-auto bg-[#0a0a0a]">
        <pre className="text-xs font-mono text-secondary">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
