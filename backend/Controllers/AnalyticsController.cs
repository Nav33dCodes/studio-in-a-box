using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IMovieAnalyticsService _analyticsService;

    public AnalyticsController(IMovieAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("test")]
    public async Task<IActionResult> TestAnalytics()
    {
        try
        {
            // Execute a real query against ClickHouse
            var vfxStats = await _analyticsService.GetAverageBudgetByVfxIntensityAsync();
            
            return Ok(new
            {
                status = "ok",
                source = "ClickHouse",
                data = new
                {
                    averageBudgetByVfx = vfxStats
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = "error",
                message = "Failed to communicate with ClickHouse.",
                details = ex.Message
            });
        }
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardData()
    {
        try
        {
            var vfxStats = await _analyticsService.GetAverageBudgetByVfxIntensityAsync();
            var scifi = await _analyticsService.GetBudgetVsBoxOfficeAnalyticsAsync("Sci-Fi");
            var action = await _analyticsService.GetBudgetVsBoxOfficeAnalyticsAsync("Action");
            var drama = await _analyticsService.GetBudgetVsBoxOfficeAnalyticsAsync("Drama");
            
            var highVfxScenes = await _analyticsService.GetSceneCostBenchmarksAsync("High");
            var lowVfxScenes = await _analyticsService.GetSceneCostBenchmarksAsync("Low");

            double totalBoxOffice = 0;
            double totalBudget = 0;
            long totalMovies = 0;
            var genres = new System.Collections.Generic.List<object>();

            if (scifi != null) { 
                totalBoxOffice += scifi.TotalBoxOffice; 
                totalBudget += scifi.TotalBudget; 
                totalMovies += scifi.MovieCount; 
                genres.Add(scifi);
            }
            if (action != null) { 
                totalBoxOffice += action.TotalBoxOffice; 
                totalBudget += action.TotalBudget; 
                totalMovies += action.MovieCount; 
                genres.Add(action);
            }
            if (drama != null) { 
                totalBoxOffice += drama.TotalBoxOffice; 
                totalBudget += drama.TotalBudget; 
                totalMovies += drama.MovieCount; 
                genres.Add(drama);
            }

            return Ok(new
            {
                status = "ok",
                data = new
                {
                    kpi = new {
                        totalBoxOffice,
                        totalBudget,
                        totalMovies,
                        roiPercentage = totalBudget > 0 ? ((totalBoxOffice - totalBudget) / totalBudget) * 100 : 0
                    },
                    genres,
                    vfxStats,
                    sceneBenchmarks = new[] { highVfxScenes, lowVfxScenes }
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "error", message = ex.Message });
        }
    }

    [HttpGet("movies")]
    public async Task<IActionResult> GetMovies([FromQuery] string genre = "Sci-Fi", [FromQuery] string vfxIntensity = "High")
    {
        try
        {
            var movies = await _analyticsService.FindSimilarMoviesAsync(genre, vfxIntensity);
            return Ok(new { status = "ok", data = movies });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { status = "error", message = ex.Message });
        }
    }
}
