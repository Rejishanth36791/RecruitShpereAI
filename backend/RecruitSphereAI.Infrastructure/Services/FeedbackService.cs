using Microsoft.EntityFrameworkCore;
using RecruitSphereAI.Core.Entities;
using RecruitSphereAI.Core.Interfaces;
using RecruitSphereAI.Persistence;

namespace RecruitSphereAI.Infrastructure.Services;

public class FeedbackService : IFeedbackService
{
    private readonly RecruitSphereDbContext _context;

    public FeedbackService(RecruitSphereDbContext context)
    {
        _context = context;
    }

    public async Task<Feedback> SubmitFeedbackAsync(Guid applicationId, Guid? reviewerUserId, string comments, int? rating)
    {
        var application = await _context.Applications.FindAsync(applicationId);
        if (application == null)
            throw new InvalidOperationException("Application not found.");

        var feedback = new Feedback
        {
            ApplicationId = applicationId,
            CandidateId = application.CandidateId,
            UserId = reviewerUserId,
            Comments = comments,
            Rating = rating,
        };

        _context.Feedbacks.Add(feedback);
        await _context.SaveChangesAsync();

        return feedback;
    }

    public async Task<IEnumerable<Feedback>> GetFeedbackByApplicationAsync(Guid applicationId)
    {
        return await _context.Feedbacks
            .Include(f => f.User)
            .Where(f => f.ApplicationId == applicationId)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
    }
}
