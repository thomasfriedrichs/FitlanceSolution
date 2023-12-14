using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitlance.Entities
{
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
        public string[]? Certifications { get; set; }
        public int HourlyRate { get; set; }
        public string? SecondLanguage { get; set; }
        public string[]? Avilability  { get; set; }
        public string[]? ClientSkill { get; set; }
        public int? ReviewCount { get; set; }
        public int? ActiveClients { get; set; }
        public virtual User User { get; set; }
    }
}