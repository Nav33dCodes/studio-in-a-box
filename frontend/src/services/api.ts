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

  // 2. Mock submission to the Agent (would be connected to Agent API)
  submitScenarioAnalysis: async (prompt: string) => {
    // In a real implementation this hits the Node.js agent proxy in backend
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        success: true, 
        message: "Analysis complete",
        report: {
          recommendedBudget: "$120M - $150M",
          historicalBenchmark: "$135M",
          vfxIntensity: "High",
          comparableCount: 24,
          recommendation: "Greenlight with caution. Sci-Fi High-VFX has high historical variance in ROI."
        }
      }), 2000);
    });
  }
};
