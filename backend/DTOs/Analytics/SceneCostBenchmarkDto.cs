namespace backend.DTOs.Analytics;

public class SceneCostBenchmarkDto
{
    public string VfxIntensity { get; set; } = string.Empty;
    public double AverageSceneCost { get; set; }
    public double MedianSceneCost { get; set; }
    public double MinSceneCost { get; set; }
    public double MaxSceneCost { get; set; }
    public long SceneCount { get; set; }
}
