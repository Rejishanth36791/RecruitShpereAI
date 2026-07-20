// RecruitSphereAI.Infrastructure/Services/JobService.cs
using Microsoft.EntityFrameworkCore;
using RecruitSphereAI.Core.Common.Enums;
using RecruitSphereAI.Core.Entities;
using RecruitSphereAI.Core.Interfaces;
using RecruitSphereAI.Persistence;

namespace RecruitSphereAI.Infrastructure.Services;

public class JobService : IJobService
{
    private readonly RecruitSphereDbContext _context;
    private readonly IAIService _aiService;

    public JobService(RecruitSphereDbContext context, IAIService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    public async Task<IEnumerable<JobPosting>> GetAllJobsAsync()
    {
        return await _context.JobPostings
            .Include(j => j.Recruiter)
            .Include(j => j.Department)
            .Where(j => j.Status == JobStatus.Published)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();
    }

    public async Task<JobPosting?> GetJobByIdAsync(Guid id)
    {
        return await _context.JobPostings
            .Include(j => j.Recruiter)
            .Include(j => j.Department)
            .FirstOrDefaultAsync(j => j.Id == id);
    }

    public async Task<JobPosting> CreateJobAsync(JobPosting job, Guid recruiterId)
    {
        job.RecruiterId = recruiterId;
        job.Status = JobStatus.Published;
        job.CreatedAt = DateTimeOffset.UtcNow;

        _context.JobPostings.Add(job);
        await _context.SaveChangesAsync();

        return job;
    }

    public async Task<IEnumerable<JobPosting>> GetJobsByRecruiterAsync(Guid recruiterId)
    {
        return await _context.JobPostings
            .Where(j => j.RecruiterId == recruiterId)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<JobPosting>> SearchJobsAsync(string? searchTerm, string? location, string? status)
    {
        var query = _context.JobPostings
            .Include(j => j.Recruiter)
            .AsQueryable();

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(j => j.Title.Contains(searchTerm) || 
                                   j.Description.Contains(searchTerm));
        }

        if (!string.IsNullOrEmpty(location))
            query = query.Where(j => j.Location != null && j.Location.Contains(location));

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<JobStatus>(status, true, out var jobStatus))
            query = query.Where(j => j.Status == jobStatus);

        return await query.OrderByDescending(j => j.CreatedAt).ToListAsync();
    }

    public async Task<bool> UpdateJobStatusAsync(Guid jobId, string status)
    {
        var job = await _context.JobPostings.FindAsync(jobId);
        if (job == null) return false;

        if (Enum.TryParse<JobStatus>(status, true, out var jobStatus))
        {
            job.Status = jobStatus;
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }

    public async Task<JobPosting?> UpdateJobAsync(Guid jobId, Guid? recruiterId, JobPosting updates)
    {
        var job = await _context.JobPostings.FindAsync(jobId);
        if (job == null) return null;

        // If a recruiterId was supplied, enforce that only the owning recruiter can edit it.
        // Admins pass recruiterId = null to bypass this check.
        if (recruiterId.HasValue && job.RecruiterId != recruiterId.Value) return null;

        job.Title = updates.Title;
        job.Description = updates.Description;
        job.Requirements = updates.Requirements;
        job.Location = updates.Location;
        job.Salary = updates.Salary;

        await _context.SaveChangesAsync();
        return job;
    }

    public async Task<bool> DeleteJobAsync(Guid jobId, Guid? recruiterId)
    {
        var job = await _context.JobPostings.FindAsync(jobId);
        if (job == null) return false;

        if (recruiterId.HasValue && job.RecruiterId != recruiterId.Value) return false;

        _context.JobPostings.Remove(job);
        await _context.SaveChangesAsync();
        return true;
    }
}