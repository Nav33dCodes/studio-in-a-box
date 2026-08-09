import { useState } from 'react';
import { Play, Sparkles, TerminalSquare, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../services/api';

interface Props {
  onAnalysisStart: () => void;
  onAnalysisComplete: (report: string) => void;
  onOpenTrace: () => void;
}

const suggestions = [
  "Compare ROI of Action vs Comedy",
  "Budget benchmark for Epic Fantasy",
  "Highest grossing low-budget Horror",
];

export default function DirectorHero({ onAnalysisStart, onAnalysisComplete, onOpenTrace }: Props) {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRun = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    onAnalysisStart();
    toast.info('Agent activated', { description: 'Routing prompt to Groq LLM via MCP...' });
    try {
      const res = await api.submitScenarioAnalysis(prompt);
      if (res.response) {
        onAnalysisComplete(res.response);
        toast.success('Analysis complete');
      }
    } catch (e) {
      console.error(e);
      onAnalysisComplete("Error: Could not reach the AI Agent. Ensure the Node.js service is running on port 3001.");
      toast.error('Connection failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnalyzing) handleRun();
  };

  return (
    <div className="animate-fade-in">
      {/* Title row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-amber" />
          <h2 className="text-[13px] font-semibold text-primary tracking-wider uppercase">Director Agent</h2>
          <div className="ml-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-blue/10 border border-accent-blue/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-blue"></span>
            </span>
            <span className="text-[10px] font-mono text-accent-blue">READY</span>
          </div>
        </div>
        <button 
          onClick={onOpenTrace}
          className="flex items-center gap-1.5 text-[11px] text-secondary hover:text-primary transition-colors"
        >
          <TerminalSquare className="w-3.5 h-3.5" />
          Execution Trace
        </button>
      </div>

      {/* Input */}
      <div className="relative mb-3">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-surface border border-border rounded-lg py-3.5 pl-4 pr-36 text-[15px] text-primary placeholder:text-muted focus:outline-none focus:border-border-light transition-colors font-light"
          placeholder="Ask the Director Agent anything about production data..."
        />
        <div className="absolute right-1.5 top-1.5 bottom-1.5">
          <button 
            onClick={handleRun}
            disabled={isAnalyzing || !prompt.trim()}
            className="h-full px-5 bg-primary text-background text-[13px] font-semibold rounded-md flex items-center gap-2 hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isAnalyzing ? (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-background border-t-transparent rounded-full" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      {/* Suggestions */}
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
