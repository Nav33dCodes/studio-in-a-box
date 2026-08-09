import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from './components/layout/AppLayout';
import CommandCenter from './pages/CommandCenter';
import ProjectsView from './pages/ProjectsView';
import DataSourcesView from './pages/DataSourcesView';
import { ScenariosView, AnalyticsView, ReportsView } from './pages/PlaceholderViews';

function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/command-center" replace />} />
        <Route path="command-center" element={<CommandCenter />} />
        
        {/* Placeholders for future pages */}
        <Route path="projects" element={<ProjectsView />} />
        <Route path="scenarios" element={<ScenariosView />} />
        <Route path="analytics" element={<AnalyticsView />} />
        <Route path="reports" element={<ReportsView />} />
        <Route path="agent-activity" element={<div className="p-8 text-secondary">Agent Activity Log (Coming Soon)</div>} />
        <Route path="data-sources" element={<DataSourcesView />} />
      </Route>
    </Routes>
    <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#111', border: '1px solid #222', color: '#fff' } }} />
    </>
  );
}

export default App;
