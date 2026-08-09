import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from './components/layout/AppLayout';
import CommandCenter from './pages/CommandCenter';

function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/command-center" replace />} />
        <Route path="command-center" element={<CommandCenter />} />
        
        {/* Placeholders for future pages */}
        <Route path="projects" element={<div className="p-8 text-secondary">Projects View (Coming Soon)</div>} />
        <Route path="scenarios" element={<div className="p-8 text-secondary">Scenarios View (Coming Soon)</div>} />
        <Route path="analytics" element={<div className="p-8 text-secondary">Analytics View (Coming Soon)</div>} />
        <Route path="reports" element={<div className="p-8 text-secondary">Reports View (Coming Soon)</div>} />
        <Route path="agent-activity" element={<div className="p-8 text-secondary">Agent Activity Log (Coming Soon)</div>} />
        <Route path="data-sources" element={<div className="p-8 text-secondary">Data Sources Config (Coming Soon)</div>} />
      </Route>
    </Routes>
    <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#111', border: '1px solid #222', color: '#fff' } }} />
    </>
  );
}

export default App;
