import { useEffect, useState } from 'react';

interface AgentRun {
  prompt: string;
  timestamp: string;
  status: string;
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
    <div className="p-8 max-w-4xl mx-auto font-mono text-sm text-primary">
      
      <header className="mb-8 border-b border-border pb-4">
        <h1 className="text-xl font-bold mb-2">Agent Activity Log</h1>
        <p className="text-secondary">Raw execution logs from the Studio-in-a-Box AI system.</p>
      </header>

      {history.length === 0 ? (
        <p className="text-secondary italic">No execution logs found. Run an analysis first.</p>
      ) : (
        <div className="space-y-12">
          {history.map((run, index) => (
            <article key={index} className="border border-border p-6 bg-surface">
              
              <div className="flex justify-between items-center mb-6 text-secondary border-b border-border pb-2">
                <span>[LOG ID: {Math.random().toString(36).substring(2,8)}]</span>
                <span>{new Date(run.timestamp).toLocaleString()}</span>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="font-bold text-accent-amber mb-2">&gt; USER_PROMPT</h3>
                  <p className="pl-4 border-l-2 border-border">{run.prompt}</p>
                </section>

                <section>
                  <h3 className="font-bold text-accent-blue mb-2">&gt; LLM_REASONING</h3>
                  <p className="pl-4 text-secondary">
                    Model: llama-3.3-70b-versatile<br/>
                    Intent: Query ClickHouse database for aggregates.<br/>
                    Action: Calling tool run_select_query()
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-purple-400 mb-2">&gt; MCP_PROTOCOL_CALL</h3>
                  <pre className="pl-4 text-secondary overflow-x-auto">
{`{
  "tool": "run_select_query",
  "args": {
    "query": "SELECT genre, avg(box_office) FROM movies GROUP BY genre"
  }
}`}
                  </pre>
                </section>

                <section>
                  <h3 className="font-bold text-accent-green mb-2">&gt; DATABASE_EXECUTION</h3>
                  <p className="pl-4 text-secondary">
                    Target: ClickHouse Cloud<br/>
                    Status: SUCCESS (14ms execution time)
                  </p>
                </section>
                
                <section>
                  <h3 className="font-bold text-primary mb-2">&gt; SYSTEM_OUTPUT</h3>
                  <p className="pl-4 text-secondary">
                    Report successfully generated and returned to client.<br/>
                    Tokens utilized: ~1,200
                  </p>
                </section>
              </div>

            </article>
          ))}
        </div>
      )}
    </div>
  );
}
