using RecruitSphereAI.Core.Entities;
using RecruitSphereAI.Persistence;
using RecruitSphereAI.Persistence.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace RecruitSphereAI.Infrastructure.Authentication;

/// <summary>
/// Service for managing refresh tokens
/// </summary>
public interface IRefreshTokenService
{
    Task<string> CreateRefreshTokenAsync(Guid userId);
    Task<bool> ValidateRefreshTokenAsync(Guid userId, string refreshToken);
    Task<bool> RevokeRefreshTokenAsync(string refreshToken);
}

public class RefreshTokenService : IRefreshTokenService
{
    private readonly RecruitSphereDbContext _context;
    private readonly int _refreshTokenExpirationDays;

    public RefreshTokenService(RecruitSphereDbContext context, IConfiguration configuration)
    {
        _context = context;
        _refreshTokenExpirationDays = int.Parse(
            configuration["Jwt:RefreshTokenExpirationDays"] ?? "7");
    }

    /// <summary>
    /// Creates and stores a new refresh token
    /// </summary>
    public async Task<string> CreateRefreshTokenAsync(Guid userId)
    {
        var refreshToken = new RefreshTokenEntity
        {
            UserId = userId,
            Token = GenerateRandomToken(),
            ExpiryDate = DateTime.UtcNow.AddDays(_refreshTokenExpirationDays),
            IsRevoked = false
        };

        // Revoke any existing tokens for this user
        var existingTokens = _context.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked);
        foreach (var token in existingTokens)
        {
            token.IsRevoked = true;
        }

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return refreshToken.Token;
    }

    /// <summary>
    /// Validates a refresh token
    /// </summary>
    public async Task<bool> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
    {
        var token = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt =>
                rt.UserId == userId &&
                rt.Token == refreshToken &&
                !rt.IsRevoked &&
                rt.ExpiryDate > DateTime.UtcNow);

        return token != null;
    }

    /// <summary>
    /// Revokes a refresh token
    /// </summary>
    public async Task<bool> RevokeRefreshTokenAsync(string refreshToken)
    {
        var token = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken && !rt.IsRevoked);

        if (token == null)
            return false;

        token.IsRevoked = true;
        await _context.SaveChangesAsync();
        return true;
    }

    private string GenerateRandomToken()
    {
        return Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator
            .GetBytes(64));
    }
}
