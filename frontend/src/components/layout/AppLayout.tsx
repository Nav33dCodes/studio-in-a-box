import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Film, Cpu, BarChart3, FileText, Activity, Database, Clapperboard, Zap
} from 'lucide-react';

const navItems = [
  { section: 'Studio', items: [
    { to: '/command-center', icon: LayoutDashboard, label: 'Command Center' },
    { to: '/projects', icon: Film, label: 'Projects' },
    { to: '/scenarios', icon: Cpu, label: 'Scenarios' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/reports', icon: FileText, label: 'Reports' },
  ]},
  { section: 'System', items: [
    { to: '/agent-activity', icon: Activity, label: 'Agent Activity' },
    { to: '/data-sources', icon: Database, label: 'Data Sources' },
  ]},
];

export default function AppLayout() {
  const location = useLocation();
  const currentPage = navItems
    .flatMap(s => s.items)
    .find(item => location.pathname.startsWith(item.to))?.label || 'Dashboard';

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-[240px] border-r border-border bg-surface flex flex-col shrink-0">

        {/* Logo */}
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-border">
          <div className="w-7 h-7 rounded-lg bg-accent-amber/10 flex items-center justify-center">
            <Clapperboard className="w-4 h-4 text-accent-amber" />
          </div>
          <span className="text-[13px] font-bold text-primary tracking-wide">STUDIO-IN-A-BOX</span>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {navItems.map(section => (
            <div key={section.section}>
              <div className="px-2 mb-2 text-[10px] font-semibold text-muted tracking-[0.15em] uppercase">
                {section.section}
              </div>
              <nav className="space-y-0.5">
                {section.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] transition-all duration-150 ${
                        isActive
                          ? 'bg-surface-raised text-primary font-medium'
                          : 'text-secondary hover:text-primary hover:bg-surface-raised/60'
                      }`
                    }
                  >
                    <item.icon size={15} className="shrink-0 opacity-70 group-hover:opacity-100" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Status Footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-surface-raised border border-border-light flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-accent-amber" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-primary leading-tight">Groq Agent</span>
              <span className="text-[11px] text-secondary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green inline-block"></span>
                Online
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="h-12 border-b border-border flex items-center justify-between px-6 shrink-0 bg-surface/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-muted font-medium tracking-wider uppercase">Production Intelligence</span>
            <span className="text-border-light">/</span>
            <span className="text-primary font-semibold">{currentPage}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-secondary bg-surface-raised px-2.5 py-1 rounded border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span>
              3 services connected
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
