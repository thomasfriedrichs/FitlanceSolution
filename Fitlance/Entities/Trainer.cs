using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitlance.Entities;

[Table("Trainers")]
public class Trainer
{
    [Key, ForeignKey("User")]
    public string TrainerId { get; set; }
    public string? Gender { get; set; }
    public string? Specialization { get; set; }
    public string? NutritionCertification { get; set; }
    public int YearsOfExperience { get; set; }
    public double Rating { get; set; }
    public int HourlyRate { get; set; }
    public string? SecondLanguage { get; set; }
    public int? ReviewCount { get; set; }
    public int? ActiveClients { get; set; }
    public virtual User User { get; set; }

    // Delimited string properties
    public string? CertificationsDelimited { get; set; }
    public string? AvailabilityDelimited { get; set; }
    public string? ClientSkillDelimited { get; set; }

    // Original array properties with conversion logic
    [NotMapped]
    public string[]? Certifications
    {
        get => string.IsNullOrEmpty(CertificationsDelimited) ? Array.Empty<string>() : CertificationsDelimited.Split(';');
        set => CertificationsDelimited = value != null ? string.Join(";", value) : string.Empty;
    }

    [NotMapped]
    public string[]? Availability
    {
        get => string.IsNullOrEmpty(AvailabilityDelimited) ? Array.Empty<string>() : AvailabilityDelimited.Split(';');
        set => AvailabilityDelimited = value != null ? string.Join(";", value) : string.Empty;
    }

    [NotMapped]
    public string[]? ClientSkill
    {
        get => string.IsNullOrEmpty(ClientSkillDelimited) ? Array.Empty<string>() : ClientSkillDelimited.Split(';');
        set => ClientSkillDelimited = value != null ? string.Join(";", value) : string.Empty;
    }
}