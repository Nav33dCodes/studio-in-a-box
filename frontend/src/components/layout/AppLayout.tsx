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
        <div className="h-16 flex items-center px-6 border-b border-border bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center">
              <Film className="w-4 h-4 text-primary opacity-80" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-extrabold text-primary tracking-widest uppercase">STUDIO-IN-A-BOX</span>
              <span className="text-[9px] font-semibold text-secondary tracking-widest uppercase">PRODUCTION INTELLIGENCE</span>
            </div>
          </div>
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
                      `group flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors duration-150 ${
                        isActive
                          ? 'bg-[#151515] text-primary font-medium shadow-[inset_1px_0_0_0_#444]'
                          : 'text-secondary hover:text-primary hover:bg-[#111]'
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
        <header className="h-14 border-b border-border flex items-center justify-between px-8 shrink-0 bg-background z-10">
          <div className="flex items-center gap-2.5 text-[12px] font-semibold">
            <span className="text-secondary tracking-widest uppercase">PRODUCTION INTELLIGENCE</span>
            <span className="text-border-light">/</span>
            <span className="text-primary">{currentPage}</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-[11px] font-medium text-secondary hover:text-primary transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-dot"></span>
              5 SYSTEMS OPERATIONAL
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
