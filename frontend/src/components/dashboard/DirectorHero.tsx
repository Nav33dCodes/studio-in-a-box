import { useState } from 'react';
import { Play, Sparkles, ArrowRight, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../services/api';
import { openEnterpriseReport } from '../../lib/report-viewer';

interface Props {
  onAnalysisStart: (prompt: string) => void;
  onAnalysisComplete: () => void;
}

const suggestions = [
  "Budget Benchmark",
  "High-VFX Analysis",
  "ROI Analysis",
  "Genre Comparison",
  "Historical Production Trends",
];

export default function DirectorHero({ onAnalysisStart, onAnalysisComplete }: Props) {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastReport, setLastReport] = useState<{report: string, prompt: string} | null>(null);

  const handleRun = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    onAnalysisStart(prompt);
    toast.info('Agent activated', { description: 'Routing prompt to Groq LLM via MCP...' });
    try {
      const res = await api.submitScenarioAnalysis(prompt);
      if (res.response) {
        onAnalysisComplete();
        setLastReport({ report: res.response, prompt });
        
        // Save to LocalStorage for the Agent Activity Log
        const history = JSON.parse(localStorage.getItem('agent_history') || '[]');
        history.unshift({ prompt, timestamp: new Date().toISOString(), status: 'success' });
        localStorage.setItem('agent_history', JSON.stringify(history.slice(0, 10))); // Keep last 10

        toast.success('Analysis complete! Opening report...');
        openEnterpriseReport(res.response, prompt);
      }
    } catch (e) {
      console.error(e);
      onAnalysisComplete();
      toast.error('Connection failed', { description: 'Could not reach the AI Agent.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnalyzing) handleRun();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-amber" />
          <h2 className="text-[13px] font-semibold text-primary tracking-wider uppercase">DIRECTOR AGENT</h2>
          <div className="ml-2 flex items-center gap-1.5 text-[10px] font-mono text-accent-amber bg-accent-amber/10 border border-accent-amber/20 px-2 py-0.5 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-amber"></span>
            READY
          </div>
        </div>
        
        {lastReport && (
          <button 
            onClick={() => openEnterpriseReport(lastReport.report, lastReport.prompt)}
            className="flex items-center gap-1.5 text-[11px] text-accent-blue hover:text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            View Last Report
          </button>
        )}
      </div>

      <div className="relative mb-3">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-background border border-border rounded-sm py-4 pl-4 pr-64 text-[14px] text-primary placeholder:text-muted focus:outline-none focus:border-accent-amber/50 transition-colors font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
          placeholder="Describe a production scenario, budget question, genre, VFX requirement, or historical comparison..."
        />
        <div className="absolute right-1.5 top-1.5 bottom-1.5">
          <button 
            onClick={handleRun}
            disabled={isAnalyzing || !prompt.trim()}
            className="h-full px-6 bg-accent-amber text-background text-[11px] font-bold tracking-wider uppercase rounded-sm flex items-center gap-2 hover:bg-accent-amber/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isAnalyzing ? (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-background border-t-transparent rounded-full" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            {isAnalyzing ? 'ANALYZING...' : 'RUN PRODUCTION ANALYSIS'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-muted">Try:</span>
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => setPrompt(s)}
            className="text-[11px] text-secondary hover:text-primary px-2 py-1 rounded border border-border hover:border-border-light transition-colors flex items-center gap-1"
          >
            {s}
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  );
}
