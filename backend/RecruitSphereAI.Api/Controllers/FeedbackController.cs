using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitSphereAI.Core.Common.Dtos;
using RecruitSphereAI.Core.Interfaces;
using RecruitSphereAI.Persistence;
using System.Security.Claims;

namespace RecruitSphereAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackService _feedbackService;
    private readonly RecruitSphereDbContext _context;
    private readonly ILogger<FeedbackController> _logger;

    public FeedbackController(
        IFeedbackService feedbackService,
        RecruitSphereDbContext context,
        ILogger<FeedbackController> logger)
    {
        _feedbackService = feedbackService;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Leave feedback (comments + optional 1-5 rating) on a candidate's application.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Recruiter,HiringManager,Admin")]
    public async Task<IActionResult> SubmitFeedback([FromBody] SubmitFeedbackRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Guid.TryParse(userIdString, out var reviewerUserId);

        try
        {
            var feedback = await _feedbackService.SubmitFeedbackAsync(
                request.ApplicationId, reviewerUserId, request.Comments, request.Rating);

            _logger.LogInformation($"Feedback {feedback.Id} submitted for application {request.ApplicationId}");
            return Created("", feedback);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get all feedback entries for a given application. Candidates may only view feedback
    /// on their own application; recruiters/hiring managers/admins can view any.
    /// </summary>
    [HttpGet("application/{applicationId}")]
    [Authorize]
    public async Task<IActionResult> GetFeedbackForApplication(Guid applicationId)
    {
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userRole == "Candidate")
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var owns = await _context.Applications
                .AnyAsync(a => a.Id == applicationId && a.Candidate.UserId == userId);
            if (!owns) return Forbid();
        }

        var feedback = await _feedbackService.GetFeedbackByApplicationAsync(applicationId);
        return Ok(feedback);
    }
}
