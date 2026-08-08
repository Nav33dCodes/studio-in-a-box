using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs.Analytics;

namespace backend.Services;

public interface IMovieAnalyticsService
{
    Task<IReadOnlyList<MovieComparisonDto>> FindSimilarMoviesAsync(string genre, string vfxIntensity);
    
    Task<BudgetBoxOfficeAnalyticsDto?> GetBudgetVsBoxOfficeAnalyticsAsync(string genre);
    
    Task<IReadOnlyList<VfxBudgetAnalyticsDto>> GetAverageBudgetByVfxIntensityAsync();
    
    Task<SceneCostBenchmarkDto?> GetSceneCostBenchmarksAsync(string vfxIntensity);
}
