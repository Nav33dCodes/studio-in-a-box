const API_BASE = 'http://localhost:5000/api';

export interface KPIStats {
  totalMovies: number;
  totalBudget: number;
  totalBoxOffice: number;
  roiPercentage: number;
}

export interface AnalyticsData {
  kpi: KPIStats;
  genres: any[];
  vfxStats: any[];
  sceneBenchmarks: any[];
}

export const api = {
  // 1. Fetch dashboard aggregated analytics from ASP.NET Core
  getDashboardAnalytics: async (): Promise<AnalyticsData> => {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    const json = await res.json();
    return json.data; // ASP.NET returns { success: true, data: {...} }
  },

  // 2. Real submission to the ASP.NET Core Agent Controller
  submitScenarioAnalysis: async (prompt: string) => {
    const res = await fetch(`${API_BASE}/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt })
    });
    if (!res.ok) throw new Error('Agent analysis failed');
    return await res.json();
  },

  // 3. Real health check for ASP.NET API
  checkHealth: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
};
