import { FileText, Download, Check } from 'lucide-react';

interface Props {
  report: string;
}

export default function IntelligenceReport({ report }: Props) {
  return (
    <div className="border border-border bg-surface-raised rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-accent-blue/10 border-b border-accent-blue/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent-blue" />
          <h3 className="text-sm font-semibold text-accent-blue tracking-widest uppercase">Generated Intelligence Report</h3>
        </div>
        <button className="text-xs text-primary bg-background border border-border px-3 py-1.5 rounded flex items-center gap-2 hover:bg-surface transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export PDF
        </button>
      </div>
      
      <div className="p-6">
        <div className="bg-background border border-border rounded-md p-4 flex gap-3 items-start">
          <div className="mt-0.5 bg-accent-amber/20 rounded-full p-1 border border-accent-amber/30 shrink-0">
            <Check className="w-4 h-4 text-accent-amber" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2">Director's Analysis</h4>
            <div className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">{report}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
