using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Fitlance.Entities;

public class RefreshToken
{
    [Key]
    public string Token { get; set; } // The actual refresh token

    public DateTime ExpiryTime { get; set; } // When the token expires

    public bool IsRevoked { get; set; } // Whether the token has been revoked

    public string Salt { get; set; } // Store the salt used for hashing the token

    [ForeignKey("User")]
    public string UserId { get; set; } // Foreign key to the User table

    public virtual User User { get; set; } // Navigation property to the User entity
}
 