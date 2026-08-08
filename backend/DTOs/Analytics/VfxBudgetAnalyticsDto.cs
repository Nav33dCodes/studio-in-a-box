namespace backend.DTOs.Analytics;

public class VfxBudgetAnalyticsDto
{
    public string VfxIntensity { get; set; } = string.Empty;
    public double AverageBudget { get; set; }
    public long MovieCount { get; set; }
}
