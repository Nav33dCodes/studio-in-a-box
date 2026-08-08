import { useEffect, useState } from 'react';
import DataExplorer from './DataExplorer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import * as signalR from '@microsoft/signalr';

export default function Dashboard({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveBoxOffice, setLiveBoxOffice] = useState<number>(0);
  const [recentSale, setRecentSale] = useState<any>(null);

  useEffect(() => {
    // 1. Fetch initial Analytics Payload
    fetch('http://localhost:5000/api/analytics/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setData(json.data);
          setLiveBoxOffice(json.data.kpi.totalBoxOffice);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching analytics", err);
        setLoading(false);
      });

    // 2. Connect to SignalR Live Telemetry
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/boxofficehub")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("Connected to SignalR Telemetry");
    }).catch(err => console.error("SignalR Connection Error: ", err));

    connection.on("ReceiveLiveSale", (saleData) => {
      setLiveBoxOffice(prev => prev + saleData.amount);
      setRecentSale(saleData);
      
      // Clear the "blink" after 2 seconds
      setTimeout(() => setRecentSale(null), 2000);
    });

    return () => {
      connection.stop();
    };
  }, []);

  if (loading || !data) {
    return (
      <div className="panel" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <i className="ph ph-spinner-gap" style={{ fontSize: 32, animation: 'spin 1s linear infinite' }}></i>
        <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14 }}>Loading Enterprise Analytics...</p>
      </div>
    );
  }

  const { kpi, genres, vfxStats, sceneBenchmarks } = data;
  const chartColors = theme === 'dark' ? { fill: '#3291FF', grid: '#333333', text: '#A0A0A0' } : { fill: '#0070F3', grid: '#EAEAEA', text: '#666666' };

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <i className="ph ph-chart-line-up" style={{ color: 'var(--brand-color)' }}></i>
          Global Command Center
          {recentSale && <span style={{ fontSize: 12, color: 'var(--success)', marginLeft: 16, animation: 'pulse 1s infinite' }}>Live: +${recentSale.amount.toLocaleString()} ({recentSale.region})</span>}
        </h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? <i className="ph ph-sun"></i> : <i className="ph ph-moon"></i>}
          {theme === 'dark' ? 'Light Mode' : 'OLED Dark'}
        </button>
      </div>

      <div className="kpi-row">
        <div className="stat-card" style={{ borderColor: recentSale ? 'var(--success)' : 'var(--border-color)', transition: 'border-color 0.2s' }}>
          <div className="stat-label">Total Box Office (Live)</div>
          <p className="stat-value">${(liveBoxOffice / 1_000_000_000).toFixed(3)}B</p>
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
        
        {/* Genre Performance (Recharts) */}
        <div className="widget" style={{ gridColumn: 'span 2', height: 300 }}>
          <h3 className="widget-title">Box Office by Genre</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={genres} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="genre" stroke={chartColors.text} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={chartColors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1_000_000_000).toFixed(1)}B`} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                formatter={(value: any) => [`$${(value / 1_000_000_000).toFixed(2)} Billion`, 'Box Office']}
              />
              <Bar dataKey="totalBoxOffice" fill={chartColors.fill} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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

        {/* VFX Analysis (Recharts) */}
        <div className="widget" style={{ height: 250 }}>
          <h3 className="widget-title">Average Budget by VFX</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vfxStats} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="vfxIntensity" stroke={chartColors.text} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={chartColors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1_000_000).toFixed(0)}M`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                formatter={(value: any) => [`$${(value / 1_000_000).toFixed(1)} Million`, 'Budget']}
              />
              <Area type="monotone" dataKey="averageBudget" stroke={chartColors.fill} fill={chartColors.fill} fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Data Explorer (TanStack Table) */}
        <DataExplorer />

      </div>
    </div>
  );
}
