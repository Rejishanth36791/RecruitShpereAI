using RecruitSphereAI.Core.Entities;

namespace RecruitSphereAI.Core.Interfaces;

public interface IAuthService
{
    Task<(bool Success, string Message, User? User)> RegisterAsync(string email, string fullName, string password, string role);
    Task<(bool Success, string Message, User? User)> LoginAsync(string email, string password);
    Task<bool> UserExistsByEmailAsync(string email);
    Task<User?> GetUserByEmailAsync(string email);
}
