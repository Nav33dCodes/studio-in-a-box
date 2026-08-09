import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import DirectorHero from '../components/dashboard/DirectorHero';
import ProductionKPIs from '../components/dashboard/ProductionKPIs';
import AnalyticsVisualization from '../components/dashboard/AnalyticsVisualization';
import LiveAgentActivity from '../components/dashboard/LiveAgentActivity';
import SystemStatus from '../components/dashboard/SystemStatus';
import AnalysisPanel from '../components/dashboard/AnalysisPanel';
import { useState } from 'react';

export default function CommandCenter() {
  const [report, setReport] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState('');
  const [agentStatus, setAgentStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: api.getDashboardAnalytics,
  });

  return (
    <div className="max-w-[1440px] mx-auto w-full relative space-y-5">

      {/* Director Agent Input */}
      <DirectorHero
        onAnalysisStart={(prompt) => { setAgentStatus('analyzing'); setReport(null); setLastPrompt(prompt); }}
        onAnalysisComplete={(rep) => { setAgentStatus('complete'); setReport(rep); }}
      />

      {/* Separator */}
      <div className="border-t border-border"></div>

      {/* KPIs */}
      <ProductionKPIs data={data?.kpi} isLoading={isLoading} />

      {/* Analysis Results Panel (appears after running analysis) */}
      {report && (
        <AnalysisPanel report={report} prompt={lastPrompt} />
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left: Chart */}
        <div className="col-span-12 xl:col-span-8">
          <AnalyticsVisualization data={data} isLoading={isLoading} />
        </div>

        {/* Right: Activity + Status */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          <LiveAgentActivity status={agentStatus} />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}
