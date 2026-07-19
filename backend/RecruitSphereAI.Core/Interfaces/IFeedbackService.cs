using RecruitSphereAI.Core.Entities;

namespace RecruitSphereAI.Core.Interfaces;

public interface IFeedbackService
{
    /// <summary>
    /// Records feedback (comments + optional 1-5 rating) left by a recruiter/hiring manager/admin
    /// against a specific application. The candidate is resolved from the application itself.
    /// </summary>
    Task<Feedback> SubmitFeedbackAsync(Guid applicationId, Guid? reviewerUserId, string comments, int? rating);

    /// <summary>
    /// All feedback entries recorded against a given application, most recent first.
    /// </summary>
    Task<IEnumerable<Feedback>> GetFeedbackByApplicationAsync(Guid applicationId);
}
