namespace backend.DTOs.Analytics;

public class BudgetBoxOfficeAnalyticsDto
{
    public string Genre { get; set; } = string.Empty;
    public double AverageBudget { get; set; }
    public double AverageBoxOffice { get; set; }
    public double TotalBudget { get; set; }
    public double TotalBoxOffice { get; set; }
    public long MovieCount { get; set; }
}
