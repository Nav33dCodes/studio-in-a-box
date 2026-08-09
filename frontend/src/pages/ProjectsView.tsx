import { FolderGit2, Plus, Users, Calendar } from 'lucide-react';

export default function ProjectsView() {
  const projects = [
    { name: 'Project Nebula', genre: 'Sci-Fi', status: 'Pre-Production', budget: '$150M', team: 42, date: 'Oct 2026' },
    { name: 'Neon Nights', genre: 'Action', status: 'Scripting', budget: '$85M', team: 12, date: 'Jan 2027' },
    { name: 'The Last Laugh', genre: 'Comedy', status: 'Greenlit', budget: '$40M', team: 28, date: 'Mar 2027' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Active Projects</h1>
          <p className="text-secondary mt-1">Manage your studio's upcoming slate</p>
        </div>
        <button className="bg-primary text-background px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-white/90 transition-colors">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.name} className="border border-border bg-surface rounded-lg p-6 hover:border-accent-blue/50 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-surface-raised rounded-md text-accent-blue group-hover:bg-accent-blue/10 transition-colors">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-surface-raised border border-border rounded-full text-secondary">
                {p.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-1">{p.name}</h3>
            <p className="text-sm text-secondary mb-6">{p.genre} • {p.budget}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-secondary">
                <Users className="w-3.5 h-3.5" />
                {p.team} members
              </div>
              <div className="flex items-center gap-1.5 text-xs text-secondary">
                <Calendar className="w-3.5 h-3.5" />
                {p.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
