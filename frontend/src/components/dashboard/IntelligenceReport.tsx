import { FileText, Download, Check } from 'lucide-react';

interface Props {
  report: {
    recommendedBudget: string;
    historicalBenchmark: string;
    vfxIntensity: string;
    comparableCount: number;
    recommendation: string;
  }
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
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div>
            <div className="text-xs text-secondary uppercase tracking-wider mb-1">Recommended Budget</div>
            <div className="text-xl font-mono text-primary">{report.recommendedBudget}</div>
          </div>
          <div>
            <div className="text-xs text-secondary uppercase tracking-wider mb-1">Historical Benchmark</div>
            <div className="text-xl font-mono text-primary">{report.historicalBenchmark}</div>
          </div>
          <div>
            <div className="text-xs text-secondary uppercase tracking-wider mb-1">VFX Intensity</div>
            <div className="text-xl font-mono text-primary">{report.vfxIntensity}</div>
          </div>
          <div>
            <div className="text-xs text-secondary uppercase tracking-wider mb-1">Comparables Analyzed</div>
            <div className="text-xl font-mono text-primary">{report.comparableCount}</div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-md p-4 flex gap-3 items-start">
          <div className="mt-0.5 bg-accent-amber/20 rounded-full p-1 border border-accent-amber/30">
            <Check className="w-4 h-4 text-accent-amber" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-1">Director's Recommendation</h4>
            <p className="text-sm text-secondary leading-relaxed">{report.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
