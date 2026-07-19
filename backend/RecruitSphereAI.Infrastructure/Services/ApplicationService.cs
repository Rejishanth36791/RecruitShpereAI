// RecruitSphereAI.Infrastructure/Services/ApplicationService.cs
using Microsoft.EntityFrameworkCore;
using RecruitSphereAI.Core.Common.Enums;
using RecruitSphereAI.Core.Entities;
using RecruitSphereAI.Core.Interfaces;
using RecruitSphereAI.Persistence;

namespace RecruitSphereAI.Infrastructure.Services;

public class ApplicationService : IApplicationService
{
    private readonly RecruitSphereDbContext _context;
    private readonly IAIService _aiService;

    public ApplicationService(RecruitSphereDbContext context, IAIService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    public async Task<Application> SubmitApplicationAsync(Guid candidateId, Guid jobPostingId)
    {
        // Prevent duplicate applications
        var existing = await _context.Applications
            .AnyAsync(a => a.CandidateId == candidateId && a.JobPostingId == jobPostingId);

        if (existing)
            throw new InvalidOperationException("You have already applied for this job.");

        var application = new Application
        {
            CandidateId = candidateId,
            JobPostingId = jobPostingId,
            Status = ApplicationStatus.Submitted,
            AppliedDate = DateTimeOffset.UtcNow
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        // Optional AI Screening
        var job = await _context.JobPostings.FindAsync(jobPostingId);
        var candidate = await _context.Candidates.FindAsync(candidateId);

        if (job != null && candidate != null)
        {
            _ = await _aiService.CalculateMatchScoreAsync(
                candidate.Skills ?? "", job.Requirements ?? "");
        }

        return application;
    }

    public async Task<IEnumerable<Application>> GetApplicationsByCandidateAsync(Guid candidateId)
    {
        return await _context.Applications
            .Include(a => a.JobPosting)
            .Where(a => a.CandidateId == candidateId)
            .OrderByDescending(a => a.AppliedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Application>> GetApplicationsByJobAsync(Guid jobPostingId)
    {
        return await _context.Applications
            .Include(a => a.Candidate)
            .Where(a => a.JobPostingId == jobPostingId)
            .ToListAsync();
    }

    public async Task<bool> UpdateApplicationStatusAsync(Guid applicationId, string status, Guid reviewerId)
    {
        var application = await _context.Applications.FindAsync(applicationId);
        if (application == null) return false;

        if (Enum.TryParse<ApplicationStatus>(status, true, out var appStatus))
        {
            application.Status = appStatus;
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }

    public async Task<Application?> GetApplicationDetailsAsync(Guid applicationId)
    {
        return await _context.Applications
            .Include(a => a.JobPosting)
            .Include(a => a.Candidate)
            .Include(a => a.Interviews)
            .FirstOrDefaultAsync(a => a.Id == applicationId);
    }
}