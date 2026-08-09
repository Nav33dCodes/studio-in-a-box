import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

// Placeholder components that we will build out next
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
  const [report, setReport] = useState<any>(null);

  // Fetch real data from ASP.NET Core API via TanStack Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: api.getDashboardAnalytics,
  });

  return (
    <div className="max-w-[1600px] mx-auto w-full relative">
      
      {/* 1. Director Agent Hero Panel */}
      <section className="mb-8">
        <DirectorHero onAnalysisComplete={(rep) => setReport(rep)} onOpenTrace={() => setIsDrawerOpen(true)} />
      </section>

      {/* Main Grid Layout for the command center */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Analytics (Takes up 8/12 space) */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
          {/* 2. KPI Cards */}
          <ProductionKPIs data={data?.kpi} isLoading={isLoading} />
          
          {/* 3. Budget vs Box Office Chart */}
          <AnalyticsVisualization data={data} isLoading={isLoading} />
          
          {/* 6. Generated Report (Only shows when report exists) */}
          {report && <IntelligenceReport report={report} />}
        </div>

        {/* Right Column: System & Agent (Takes up 4/12 space) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
          {/* 4. Live Agent Activity */}
          <LiveAgentActivity />
          
          {/* 5. System Status */}
          <SystemStatus />
        </div>

      </div>

      {/* 7. Agent Execution Trace Drawer (Slide out from right) */}
      <ExecutionTraceDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

    </div>
  );
}
