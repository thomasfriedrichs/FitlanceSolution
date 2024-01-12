    using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Fitlance.Entities;

public class RefreshToken
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Token { get; set; } 

    public DateTime ExpiryTime { get; set; }

    public bool IsRevoked { get; set; }

    public string Salt { get; set; } 

    [ForeignKey("User")]
    public string UserId { get; set; }

    public virtual User User { get; set; } 
}
 