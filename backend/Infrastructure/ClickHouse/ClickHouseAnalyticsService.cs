using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using ClickHouse.Client.ADO;
using Microsoft.Extensions.Configuration;
using backend.DTOs.Analytics;
using backend.Services;

namespace backend.Infrastructure.ClickHouse;

public class ClickHouseAnalyticsService : IMovieAnalyticsService
{
    private readonly string _connectionString;

    public ClickHouseAnalyticsService(IConfiguration configuration)
    {
        var host = configuration["ClickHouse:Host"] ?? "localhost";
        var port = configuration["ClickHouse:Port"] ?? "8443";
        var user = configuration["ClickHouse:Username"] ?? "default";
        var password = configuration["ClickHouse:Password"] ?? "";
        var database = configuration["ClickHouse:Database"] ?? "default";

        // Enable SSL / HTTPS if connecting to ClickHouse Cloud
        var protocol = host.Contains("clickhouse.cloud") ? ";Protocol=https" : "";
        _connectionString = $"Host={host};Port={port};Username={user};Password={password};Database={database}{protocol}";
    }

    private ClickHouseConnection GetConnection() => new ClickHouseConnection(_connectionString);

    private void AddParameter(ClickHouseCommand command, string name, object value)
    {
        var parameter = command.CreateParameter();
        parameter.ParameterName = name;
        parameter.Value = value;
        command.Parameters.Add(parameter);
    }

    public async Task<IReadOnlyList<MovieComparisonDto>> FindSimilarMoviesAsync(string genre, string vfxIntensity)
    {
        var results = new List<MovieComparisonDto>();
        using var connection = GetConnection();
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        command.CommandText = @"
            SELECT movie_id, title, genre, production_budget, box_office, vfx_intensity 
            FROM movies 
            WHERE genre = {genre:String} AND vfx_intensity = {vfx:String}
            ORDER BY box_office DESC 
            LIMIT 10";
            
        AddParameter(command, "genre", genre);
        AddParameter(command, "vfx", vfxIntensity);

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            results.Add(new MovieComparisonDto
            {
                MovieId = reader.GetGuid(0),
                Title = reader.GetString(1),
                Genre = reader.GetString(2),
                ProductionBudget = reader.GetDouble(3),
                BoxOffice = reader.GetDouble(4),
                VfxIntensity = reader.GetString(5)
            });
        }
        return results;
    }

    public async Task<BudgetBoxOfficeAnalyticsDto?> GetBudgetVsBoxOfficeAnalyticsAsync(string genre)
    {
        using var connection = GetConnection();
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        command.CommandText = @"
            SELECT 
                genre,
                avg(production_budget) as avg_budget,
                avg(box_office) as avg_box_office,
                sum(production_budget) as total_budget,
                sum(box_office) as total_box_office,
                count() as movie_count
            FROM movies
            WHERE genre = {genre:String}
            GROUP BY genre";
            
        AddParameter(command, "genre", genre);

        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new BudgetBoxOfficeAnalyticsDto
            {
                Genre = reader.GetString(0),
                AverageBudget = Convert.ToDouble(reader.GetValue(1)),
                AverageBoxOffice = Convert.ToDouble(reader.GetValue(2)),
                TotalBudget = Convert.ToDouble(reader.GetValue(3)),
                TotalBoxOffice = Convert.ToDouble(reader.GetValue(4)),
                MovieCount = Convert.ToInt64(reader.GetValue(5))
            };
        }
        return null;
    }

    public async Task<IReadOnlyList<VfxBudgetAnalyticsDto>> GetAverageBudgetByVfxIntensityAsync()
    {
        var results = new List<VfxBudgetAnalyticsDto>();
        using var connection = GetConnection();
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        command.CommandText = @"
            SELECT 
                vfx_intensity,
                avg(production_budget) as avg_budget,
                count() as movie_count
            FROM movies
            GROUP BY vfx_intensity
            ORDER BY avg_budget ASC";

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            results.Add(new VfxBudgetAnalyticsDto
            {
                VfxIntensity = reader.GetString(0),
                AverageBudget = Convert.ToDouble(reader.GetValue(1)),
                MovieCount = Convert.ToInt64(reader.GetValue(2))
            });
        }
        return results;
    }

    public async Task<SceneCostBenchmarkDto?> GetSceneCostBenchmarksAsync(string vfxIntensity)
    {
        using var connection = GetConnection();
        await connection.OpenAsync();

        using var command = connection.CreateCommand();
        // ClickHouse median function is median() or quantile(0.5)
        command.CommandText = @"
            SELECT 
                vfx_intensity,
                avg(estimated_scene_cost) as avg_cost,
                median(estimated_scene_cost) as median_cost,
                min(estimated_scene_cost) as min_cost,
                max(estimated_scene_cost) as max_cost,
                count() as scene_count
            FROM scenes
            WHERE vfx_intensity = {vfx:String}
            GROUP BY vfx_intensity";
            
        AddParameter(command, "vfx", vfxIntensity);

        using var reader = await command.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new SceneCostBenchmarkDto
            {
                VfxIntensity = reader.GetString(0),
                AverageSceneCost = Convert.ToDouble(reader.GetValue(1)),
                MedianSceneCost = Convert.ToDouble(reader.GetValue(2)),
                MinSceneCost = Convert.ToDouble(reader.GetValue(3)),
                MaxSceneCost = Convert.ToDouble(reader.GetValue(4)),
                SceneCount = Convert.ToInt64(reader.GetValue(5))
            };
        }
        return null;
    }
}
