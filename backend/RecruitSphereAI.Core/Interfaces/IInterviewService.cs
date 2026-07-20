using RecruitSphereAI.Core.Entities;

namespace RecruitSphereAI.Core.Interfaces;

public interface IInterviewService
{
    Task<Interview> ScheduleInterviewAsync(Guid applicationId, DateTime scheduledDate, string mode);
    Task<IEnumerable<Interview>> GetInterviewsByCandidateAsync(Guid candidateId);
    Task<IEnumerable<Interview>> GetInterviewsByRecruiterAsync(Guid recruiterId);
    Task<bool> UpdateInterviewStatusAsync(Guid interviewId, string status);
}
