namespace RecruitSphereAI.Persistence.Entities;

/// <summary>
/// Represents a refresh token stored in the database
/// </summary>
public class RefreshTokenEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
