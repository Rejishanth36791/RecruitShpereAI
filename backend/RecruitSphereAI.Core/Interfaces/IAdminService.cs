using RecruitSphereAI.Core.Common.Dtos;

namespace RecruitSphereAI.Core.Interfaces;

public interface IAdminService
{
    /// <summary>All registered user accounts (no password data), for the Admin user-management view.</summary>
    Task<IEnumerable<UserDto>> GetAllUsersAsync();

    /// <summary>Platform-wide counts across users, jobs, applications and interviews.</summary>
    Task<AdminAnalyticsResponse> GetAnalyticsAsync();
}
