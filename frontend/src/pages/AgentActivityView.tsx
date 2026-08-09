import { Activity, Terminal } from 'lucide-react';

export default function AgentActivityView() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500 flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="w-16 h-16 bg-surface-raised rounded-2xl flex items-center justify-center mb-6 border border-border">
        <Activity className="w-8 h-8 text-accent-green" />
      </div>
      <h1 className="text-2xl font-bold text-primary tracking-tight mb-2">Agent Activity Log</h1>
      <p className="text-secondary max-w-md">
        View historical execution traces, token usage, and MCP tool invocations from the Director Agent.
      </p>
      <button className="mt-8 px-6 py-2.5 bg-surface-raised border border-border text-primary rounded-md font-medium hover:bg-border transition-colors flex items-center gap-2">
        <Terminal className="w-4 h-4" /> Open Live Stream
      </button>
    </div>
  );
}
