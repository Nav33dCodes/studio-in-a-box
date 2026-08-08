using System;

namespace backend.Models;

public class Scene
{
    public Guid SceneId { get; set; }
    public Guid MovieId { get; set; }
    public ushort SceneNumber { get; set; }
    public string LocationType { get; set; } = string.Empty;
    public string IndoorOutdoor { get; set; } = string.Empty;
    public string TimeOfDay { get; set; } = string.Empty;
    public ushort CharacterCount { get; set; }
    public ushort PropCount { get; set; }
    public string VfxIntensity { get; set; } = string.Empty;
    public ushort SpecialEquipment { get; set; }
    public double EstimatedSceneCost { get; set; }
    public string ProductionComplexity { get; set; } = string.Empty;
}
