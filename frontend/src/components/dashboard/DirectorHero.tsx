import { useState } from 'react';
import { Play, Sparkles, TerminalSquare } from 'lucide-react';
import { api } from '../../services/api';

interface Props {
  onAnalysisComplete: (report: any) => void;
  onOpenTrace: () => void;
}

export default function DirectorHero({ onAnalysisComplete, onOpenTrace }: Props) {
  const [prompt, setPrompt] = useState('Analyze a $50M high-VFX Sci-Fi project');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRun = async () => {
    setIsAnalyzing(true);
    try {
      const res = await api.submitScenarioAnalysis(prompt);
      if (res.success) {
        onAnalysisComplete(res.report);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative rounded-xl border border-border bg-surface overflow-hidden shadow-glow">
      {/* Decorative background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-amber/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="p-8 relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-accent-amber w-5 h-5" />
          <h2 className="text-lg font-medium text-primary tracking-wide">DIRECTOR AGENT</h2>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
            </span>
            <span className="text-xs font-mono text-accent-blue uppercase tracking-widest">Awaiting Prompt</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-4 pl-4 pr-32 text-primary font-medium focus:outline-none focus:border-accent-amber/50 focus:ring-1 focus:ring-accent-amber/50 transition-all text-lg placeholder:text-secondary/50"
              placeholder="E.g. What is the historical ROI of low-budget Horror?"
            />
            <div className="absolute right-2 top-2 bottom-2">
              <button 
                onClick={handleRun}
                disabled={isAnalyzing}
                className="h-full px-6 bg-primary text-background font-semibold rounded-md flex items-center gap-2 hover:bg-white/90 disabled:opacity-50 transition-colors"
              >
                {isAnalyzing ? (
                  <span className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                {isAnalyzing ? 'ANALYZING...' : 'ANALYZE'}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2 text-xs">
              <span className="text-secondary font-medium">SUGGESTIONS:</span>
              <button onClick={() => setPrompt("Compare ROI of Action vs Comedy")} className="text-accent-blue hover:underline">Compare ROI of Action vs Comedy</button>
              <span className="text-border">•</span>
              <button onClick={() => setPrompt("Budget benchmark for Epic Fantasy")} className="text-accent-blue hover:underline">Budget benchmark for Epic Fantasy</button>
            </div>
            
            <button 
              onClick={onOpenTrace}
              className="flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors border border-border px-3 py-1.5 rounded-md bg-background"
            >
              <TerminalSquare className="w-3.5 h-3.5" />
              VIEW EXECUTION TRACE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
