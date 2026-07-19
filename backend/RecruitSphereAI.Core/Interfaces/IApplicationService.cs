// RecruitSphereAI.Core/Interfaces/IApplicationService.cs
using RecruitSphereAI.Core.Entities;

namespace RecruitSphereAI.Core.Interfaces;

public interface IApplicationService
{
    Task<Application> SubmitApplicationAsync(Guid candidateId, Guid jobPostingId);
    Task<IEnumerable<Application>> GetApplicationsByCandidateAsync(Guid candidateId);
    Task<IEnumerable<Application>> GetApplicationsByJobAsync(Guid jobPostingId);
    Task<bool> UpdateApplicationStatusAsync(Guid applicationId, string status, Guid reviewerId);
    Task<Application?> GetApplicationDetailsAsync(Guid applicationId);
}