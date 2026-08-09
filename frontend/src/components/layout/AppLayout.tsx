import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Film, 
  Clapperboard, 
  BarChart3, 
  FileText, 
  Activity, 
  Database,
  Cpu
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary font-semibold tracking-wide">
            <Clapperboard className="w-5 h-5 text-accent-amber" />
            <span>Studio-in-a-Box</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          
          {/* STUDIO SECTION */}
          <div>
            <h3 className="px-2 text-xs font-semibold text-secondary tracking-wider uppercase mb-3">
              Studio
            </h3>
            <nav className="space-y-1">
              <NavItem to="/command-center" icon={<LayoutDashboard size={18} />}>
                Command Center
              </NavItem>
              <NavItem to="/projects" icon={<Film size={18} />}>
                Projects
              </NavItem>
              <NavItem to="/scenarios" icon={<Cpu size={18} />}>
                Scenarios
              </NavItem>
              <NavItem to="/analytics" icon={<BarChart3 size={18} />}>
                Analytics
              </NavItem>
              <NavItem to="/reports" icon={<FileText size={18} />}>
                Reports
              </NavItem>
            </nav>
          </div>

          {/* SYSTEM SECTION */}
          <div>
            <h3 className="px-2 text-xs font-semibold text-secondary tracking-wider uppercase mb-3">
              System
            </h3>
            <nav className="space-y-1">
              <NavItem to="/agent-activity" icon={<Activity size={18} />}>
                Agent Activity
              </NavItem>
              <NavItem to="/data-sources" icon={<Database size={18} />}>
                Data Sources
              </NavItem>
            </nav>
          </div>
          
        </div>
        
        {/* User Profile / Status */}
        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-surface-raised border border-border flex items-center justify-center">
              <span className="text-xs font-medium text-primary">JD</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-primary">Production Exec</span>
              <span className="text-xs text-secondary flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                System Online
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 shrink-0 bg-background/50 backdrop-blur-sm z-10 sticky top-0">
          <h1 className="text-sm font-medium text-secondary">
            PRODUCTION INTELLIGENCE <span className="text-border mx-2">/</span> <span className="text-primary">COMMAND CENTER</span>
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
}

function NavItem({ to, icon, children }: { to: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200",
        isActive 
          ? "bg-surface-raised text-primary font-medium" 
          : "text-secondary hover:text-primary hover:bg-surface-raised/50"
      )}
    >
      {icon}
      {children}
    </NavLink>
  );
}
