import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import DirectorHero from '../components/dashboard/DirectorHero';
import ProductionKPIs from '../components/dashboard/ProductionKPIs';
import AnalyticsVisualization from '../components/dashboard/AnalyticsVisualization';
import LiveAgentActivity from '../components/dashboard/LiveAgentActivity';
import SystemStatus from '../components/dashboard/SystemStatus';
import IntelligenceReport from '../components/dashboard/IntelligenceReport';
import ExecutionTraceDrawer from '../components/dashboard/ExecutionTraceDrawer';
import { useState } from 'react';

export default function CommandCenter() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: api.getDashboardAnalytics,
  });

  return (
    <div className="max-w-[1440px] mx-auto w-full relative space-y-5">

      {/* Director Agent Input */}
      <DirectorHero
        onAnalysisStart={() => { setAgentStatus('analyzing'); setReport(null); }}
        onAnalysisComplete={(rep) => { setAgentStatus('complete'); setReport(rep); }}
        onOpenTrace={() => setIsDrawerOpen(true)}
      />

      {/* Separator */}
      <div className="border-t border-border"></div>

      {/* KPIs */}
      <ProductionKPIs data={data?.kpi} isLoading={isLoading} />

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left: Chart + Report */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
          <AnalyticsVisualization data={data} isLoading={isLoading} />
          {report && <IntelligenceReport report={report} />}
        </div>

        {/* Right: Activity + Status */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          <LiveAgentActivity status={agentStatus} />
          <SystemStatus />
        </div>
      </div>

      {/* Drawer */}
      <ExecutionTraceDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
