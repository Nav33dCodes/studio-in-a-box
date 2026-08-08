using System;

namespace backend.DTOs.Analytics;

public class MovieComparisonDto
{
    public Guid MovieId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public double ProductionBudget { get; set; }
    public double BoxOffice { get; set; }
    public string VfxIntensity { get; set; } = string.Empty;
}
