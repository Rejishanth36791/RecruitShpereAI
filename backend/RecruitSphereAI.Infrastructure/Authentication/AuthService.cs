using RecruitSphereAI.Core.Entities;
using RecruitSphereAI.Core.Common.Enums;
using RecruitSphereAI.Core.Common.ValueObjects;
using RecruitSphereAI.Core.Interfaces;
using RecruitSphereAI.Persistence;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace RecruitSphereAI.Infrastructure.Authentication;

public class AuthService : IAuthService
{
    private readonly RecruitSphereDbContext _context;

    public AuthService(RecruitSphereDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Registers a new user with hashed password
    /// </summary>
    public async Task<(bool Success, string Message, User? User)> RegisterAsync(
        string email, string fullName, string password, string role)
    {
        try
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                return (false, "Email and password are required.", null);
            }

            if (password.Length < 8)
            {
                return (false, "Password must be at least 8 characters long.", null);
            }

            // Check if user already exists
            if (await UserExistsByEmailAsync(email))
            {
                return (false, "A user with this email already exists.", null);
            }

            // Hash password using BCrypt
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            // Create new user
            var user = new User
            {
                Email = new(email),
                FullName = fullName,
                PasswordHash = hashedPassword,
                Role = Enum.Parse<UserRole>(role, ignoreCase: true)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create profile
            if (user.Role == UserRole.Candidate)
            {
                var candidate = new Candidate { UserId = user.Id };
                _context.Candidates.Add(candidate);
                await _context.SaveChangesAsync();
            }
            else if (user.Role == UserRole.Recruiter)
            {
                var defaultOrg = await _context.Organizations.FirstOrDefaultAsync(o => o.Name == "Default Organization");
                if (defaultOrg == null)
                {
                    defaultOrg = new Organization
                    {
                        Name = "Default Organization",
                        Description = "Placeholder organization."
                    };
                    _context.Organizations.Add(defaultOrg);
                    await _context.SaveChangesAsync();
                }

                var recruiter = new Recruiter
                {
                    UserId = user.Id,
                    OrganizationId = defaultOrg.Id
                };
                _context.Recruiters.Add(recruiter);
                await _context.SaveChangesAsync();
            }

            return (true, "User registered successfully.", user);
        }
        catch (Exception ex)
        {
            return (false, $"An error occurred during registration: {ex.Message}", null);
        }
    }

    /// <summary>
    /// Authenticates a user by validating email and password
    /// </summary>
    public async Task<(bool Success, string Message, User? User)> LoginAsync(
        string email, string password)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                return (false, "Email and password are required.", null);
            }

            var user = await GetUserByEmailAsync(email);
            if (user == null)
            {
                return (false, "Invalid email or password.", null);
            }

            // Verify password using BCrypt
            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return (false, "Invalid email or password.", null);
            }

            return (true, "Login successful.", user);
        }
        catch (Exception ex)
        {
            return (false, $"An error occurred during login: {ex.Message}", null);
        }
    }

    /// <summary>
    /// Checks if a user exists by email
    /// </summary>
    public async Task<bool> UserExistsByEmailAsync(string email)
    {
        // Compare the whole converted property (EF translates this via the EmailAddress
        // HasConversion mapping) rather than accessing .Value inside the query, which EF
        // Core cannot translate to SQL and throws at runtime.
        var normalizedEmail = new EmailAddress(email);
        return await _context.Users.AnyAsync(u => u.Email == normalizedEmail);
    }

    /// <summary>
    /// Retrieves a user by email
    /// </summary>
    public async Task<User?> GetUserByEmailAsync(string email)
    {
        var normalizedEmail = new EmailAddress(email);
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
    }
}
