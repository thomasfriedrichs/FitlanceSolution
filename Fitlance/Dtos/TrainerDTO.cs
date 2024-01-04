public class TrainerDTO
{
    // User-related properties
    public string Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public DateTime? CreateTime { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? City { get; set; }
    public int? ZipCode { get; set; }
    public string? Bio { get; set; }

    // Trainer-related properties
    public string? Gender { get; set; }
    public string? Specialization { get; set; }
    public string? NutritionCertification { get; set; }
    public int YearsOfExperience { get; set; }
    public double Rating { get; set; }
    public int HourlyRate { get; set; }
    public string? SecondLanguage { get; set; }
    public int? ReviewCount { get; set; }
    public int? ActiveClients { get; set; }
    public string[]? Certifications { get; set; }
    public string[]? Availability { get; set; }
    public string[]? ClientSkill { get; set; }
}

