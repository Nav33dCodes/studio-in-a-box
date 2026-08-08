using System;

namespace backend.Models;

public class Movie
{
    public Guid MovieId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public ushort ReleaseYear { get; set; }
    public double ProductionBudget { get; set; }
    public double BoxOffice { get; set; }
    public double MarketingBudget { get; set; }
    public ushort RuntimeMinutes { get; set; }
    public ushort SceneCount { get; set; }
    public ushort LocationCount { get; set; }
    public ushort CastSize { get; set; }
    public string VfxIntensity { get; set; } = string.Empty;
    public double OpeningWeekend { get; set; }
    public double InternationalBoxOffice { get; set; }
}
