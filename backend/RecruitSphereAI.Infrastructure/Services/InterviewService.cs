using Microsoft.EntityFrameworkCore;
using RecruitSphereAI.Core.Common.Enums;
using RecruitSphereAI.Core.Entities;
using RecruitSphereAI.Core.Interfaces;
using RecruitSphereAI.Persistence;

namespace RecruitSphereAI.Infrastructure.Services;

public class InterviewService : IInterviewService
{
    private readonly RecruitSphereDbContext _context;

    public InterviewService(RecruitSphereDbContext context)
    {
        _context = context;
    }

    public async Task<Interview> ScheduleInterviewAsync(Guid applicationId, DateTime scheduledDate, string mode)
    {
        var interview = new Interview
        {
            ApplicationId = applicationId,
            ScheduledDate = scheduledDate,
            MeetingLink = mode,
            Status = InterviewStatus.Scheduled
        };

        _context.Interviews.Add(interview);
        await _context.SaveChangesAsync();

        return interview;
    }

    public async Task<IEnumerable<Interview>> GetInterviewsByCandidateAsync(Guid candidateId)
    {
        return await _context.Interviews
            .Include(i => i.Application)
                .ThenInclude(a => a.JobPosting)
            .Where(i => i.Application.CandidateId == candidateId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Interview>> GetInterviewsByRecruiterAsync(Guid recruiterId)
    {
        return await _context.Interviews
            .Include(i => i.Application)
            .Where(i => i.Application.JobPosting.RecruiterId == recruiterId)
            .ToListAsync();
    }

    public async Task<bool> UpdateInterviewStatusAsync(Guid interviewId, string status)
    {
        var interview = await _context.Interviews.FindAsync(interviewId);
        if (interview == null) return false;

        if (Enum.TryParse<InterviewStatus>(status, true, out var interviewStatus))
        {
            interview.Status = interviewStatus;
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }
}