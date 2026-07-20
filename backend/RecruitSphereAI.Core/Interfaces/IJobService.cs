// RecruitSphereAI.Core/Interfaces/IJobService.cs
using RecruitSphereAI.Core.Entities;

namespace RecruitSphereAI.Core.Interfaces;

public interface IJobService
{
    Task<IEnumerable<JobPosting>> GetAllJobsAsync();
    Task<JobPosting?> GetJobByIdAsync(Guid id);
    Task<JobPosting> CreateJobAsync(JobPosting job, Guid recruiterId);
    Task<IEnumerable<JobPosting>> GetJobsByRecruiterAsync(Guid recruiterId);
    Task<IEnumerable<JobPosting>> SearchJobsAsync(string? searchTerm, string? location, string? status);
    Task<bool> UpdateJobStatusAsync(Guid jobId, string status);

    /// <summary>
    /// Updates a job posting's editable fields (title, description, requirements, location, salary).
    /// Returns null if the job doesn't exist, or if it exists but isn't owned by the given recruiter
    /// (pass recruiterId = null to skip the ownership check, e.g. for Admins).
    /// </summary>
    Task<JobPosting?> UpdateJobAsync(Guid jobId, Guid? recruiterId, JobPosting updates);

    /// <summary>
    /// Deletes a job posting. Returns false if it doesn't exist, or if it exists but isn't owned
    /// by the given recruiter (pass recruiterId = null to skip the ownership check, e.g. for Admins).
    /// </summary>
    Task<bool> DeleteJobAsync(Guid jobId, Guid? recruiterId);
}
