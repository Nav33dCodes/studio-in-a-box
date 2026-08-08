import { useEffect, useState } from 'react';
import DataExplorer from './DataExplorer';

export default function Dashboard({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/analytics/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.data) setData(json.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching analytics", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="panel" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <i className="ph ph-spinner-gap" style={{ fontSize: 32, animation: 'spin 1s linear infinite' }}></i>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14 }}>Loading Analytics...</p>
      </div>
    );
  }

  const { kpi, genres, vfxStats, sceneBenchmarks } = data;
  const maxGenreBO = Math.max(...genres.map((g: any) => g.totalBoxOffice));
  const maxVfxBudget = Math.max(...vfxStats.map((v: any) => v.averageBudget));

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <i className="ph ph-chart-line-up" style={{ color: 'var(--brand-color)' }}></i>
          Studio Analytics
        </h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? <i className="ph ph-sun"></i> : <i className="ph ph-moon"></i>}
          {theme === 'dark' ? 'Light Mode' : 'OLED Dark'}
        </button>
      </div>

      <div className="kpi-row">
        <div className="stat-card">
          <div className="stat-label">Total Box Office</div>
          <p className="stat-value">${(kpi.totalBoxOffice / 1_000_000_000).toFixed(2)}B</p>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Budgets</div>
          <p className="stat-value">${(kpi.totalBudget / 1_000_000_000).toFixed(2)}B</p>
        </div>
        <div className="stat-card">
          <div className="stat-label">Global ROI</div>
          <p className="stat-value" style={{ color: kpi.roiPercentage > 0 ? 'var(--success)' : 'inherit' }}>
            {kpi.roiPercentage > 0 ? '+' : ''}{kpi.roiPercentage.toFixed(1)}%
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-label">Movies Analysed</div>
          <p className="stat-value">{kpi.totalMovies.toLocaleString()}</p>
        </div>
      </div>

      <div className="command-center">
        
        {/* Genre Performance */}
        <div className="widget" style={{ gridColumn: 'span 2' }}>
          <h3 className="widget-title">Box Office by Genre</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {genres.map((g: any, idx: number) => (
              <div key={idx} className="chart-row">
                <div className="chart-label">{g.genre}</div>
                <div className="chart-bar-bg">
                  <div className="chart-bar-fill" style={{ width: `${(g.totalBoxOffice / maxGenreBO) * 100}%` }}></div>
                </div>
                <div className="chart-value">${(g.totalBoxOffice / 1_000_000_000).toFixed(1)}B</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scene Benchmarks */}
        <div className="widget">
          <h3 className="widget-title">Scene Benchmarks</h3>
          {sceneBenchmarks.map((sb: any, idx: number) => sb && (
            <div key={idx} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{sb.vfxIntensity} VFX Scenes</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Median Cost: </span>
                <span>${(sb.medianSceneCost / 1_000).toFixed(1)}k</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Max Cost: </span>
                <span>${(sb.maxSceneCost / 1_000).toFixed(1)}k</span>
              </div>
            </div>
          ))}
        </div>

        {/* VFX Analysis */}
        <div className="widget">
          <h3 className="widget-title">Budget by VFX</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {vfxStats.map((stat: any, idx: number) => (
              <div key={idx} className="chart-row">
                <div className="chart-label">{stat.vfxIntensity}</div>
                <div className="chart-bar-bg">
                  <div className="chart-bar-fill" style={{ width: `${(stat.averageBudget / maxVfxBudget) * 100}%`, background: 'var(--text-primary)' }}></div>
                </div>
                <div className="chart-value">${(stat.averageBudget / 1_000_000).toFixed(1)}M</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Explorer */}
        <DataExplorer />

      </div>
    </div>
  );
}
