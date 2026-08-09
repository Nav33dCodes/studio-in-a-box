import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import DirectorHero from '../components/dashboard/DirectorHero';
import ProductionKPIs from '../components/dashboard/ProductionKPIs';
import AnalyticsVisualization from '../components/dashboard/AnalyticsVisualization';
import LiveAgentActivity from '../components/dashboard/LiveAgentActivity';
import SystemStatus from '../components/dashboard/SystemStatus';
import { useState } from 'react';

export default function CommandCenter() {
  const [agentStatus, setAgentStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: api.getDashboardAnalytics,
  });

  return (
    <div className="max-w-[1440px] mx-auto w-full relative space-y-5">
      
      {/* Director Agent Input */}
      <DirectorHero 
        onAnalysisStart={() => setAgentStatus('analyzing')}
        onAnalysisComplete={() => setAgentStatus('complete')} 
      />

      {/* Separator */}
      <div className="border-t border-border"></div>

      {/* KPIs */}
      <ProductionKPIs data={data?.kpi} isLoading={isLoading} />

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
